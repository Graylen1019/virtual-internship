import { useModal } from "@/app/context/modal-context";
import { db } from "@/app/lib/utils/firebase-client";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { StarIcon, Clock10Icon, MicIcon, LightbulbIcon, BookOpenIcon, BookmarkIcon, BookmarkPlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Book {
    id: string;
    author: string;
    title: string;
    subTitle: string;
    imageLink: string;
    audioLink: string;
    totalRating: number;
    averageRating: number;
    keyIdeas: number;
    type: string;
    status: string;
    subscriptionRequired: boolean;
    summary: string;
    tags: string[];
    bookDescription: string;
    authorDescription: string;
}

export const BookPageContent = () => {


    const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string | null>(null);



    const params = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBookInLibrary, setIsBookInLibrary] = useState(false);

    const { openSignInModal } = useModal();



    const router = useRouter();

    const auth = getAuth();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get<Book>(
                    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`
                );
                setBook(res.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response) {
                    setError(
                        `HTTP error! status: ${err.response.status} - ${err.response.statusText}`
                    );
                } else {
                    setError("Unknown error");
                }
                console.error("Failed to fetch book:", err);
            } finally {
                setLoading(false);
            }
        };

        const checkBookInLibrary = async (userId: string, bookId: string) => {
            const bookDocRef = doc(db, "users", userId, "myBooks", bookId);
            const bookDocSnap = await getDoc(bookDocRef);
            return bookDocSnap.exists();
        };

        const checkAndSetLibraryStatus = async () => {
            const currentUser = auth.currentUser;
            if (currentUser && params.id) {
                const inLibrary = await checkBookInLibrary(currentUser.uid, params.id);
                setIsBookInLibrary(inLibrary);
            }
        };

        const fetchUserSubscriptionStatus = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserSubscriptionStatus(userDocSnap.data().subscriptionStatus);
                }
            }
        };

        if (params.id) {
            fetchBook();
            fetchUserSubscriptionStatus();
            checkAndSetLibraryStatus();
        }
    }, [params.id, auth.currentUser]);

    const handleAddToLibrary = async () => {
        const currentUser = auth.currentUser;
        if (!book || !currentUser) {
            openSignInModal()
            return;
        }

        try {
            const userId = currentUser.uid;
            const userDocRef = doc(db, "users", userId);

            // Ensure the user document exists
            await setDoc(userDocRef, {
                email: currentUser.email,
                lastActive: serverTimestamp()
            }, { merge: true });

            const bookDocRef = doc(userDocRef, "myBooks", book.id);

            await setDoc(bookDocRef, {
                ...book,
                addedAt: serverTimestamp(),
            });

            setIsBookInLibrary(true);
        } catch (err) {
            console.error("Failed to add book to library:", err);
        }
    };

    const handleRemoveFromLibrary = async () => {
        const currentUser = auth.currentUser;
        if (!book || !currentUser) {
            return;
        }

        try {
            const userId = currentUser.uid;
            const bookDocRef = doc(db, "users", userId, "myBooks", book.id);

            await deleteDoc(bookDocRef);

            setIsBookInLibrary(false); // Update state to reflect the change
        } catch (err) {
            console.error("Failed to remove book from library:", err);
        }
    };

    const handleReadListenClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            openSignInModal();
            return;
        }
        if (book?.subscriptionRequired && userSubscriptionStatus !== 'premium') {
            router.push('/upgrade-subscription');
        } else {
            router.push(`/player/${book?.id}`);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <p className="text-xl text-gray-700">Loading book...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <p className="text-xl">Error: {error}</p>
                <p className="text-gray-700">
                    Could not load book. Please try again later.
                </p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="p-8 text-center text-gray-700">
                <p>No book found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl w-full mx-auto px-6 py-10">

            <div className="gap-4 flex">
                <div className="w-full">
                    <div>
                        {book.subscriptionRequired ? (
                            <h1 className="flex text-[#032b41] mb-4 font-semibold text-[32px]">

                                {book.title} &nbsp;(Premium)
                            </h1>
                        ) : (
                            <h1 className="flex text-[#032b41] mb-4 font-semibold text-[32px]">

                                {book.title}
                            </h1>
                        )}
                        <p className="text-[#032b41] mb-4 font-semibold">{book.author}</p>
                        <p className="text-xl text-[#032b41] mb-4 font-light">{book.subTitle}</p>
                    </div>
                    <div className="border-t-[1px] border-[#e1e7ea] border-b-[1px] py-4 mb-6">
                        <div className="flex flex-wrap max-w-[400px] gap-y-3">
                            <div className="flex items-center w-1/2 text-[#032b41] font-medium text-sm gap-x-2">
                                <div className="h-5 w-5"> <StarIcon size={20} /> </div>
                                <div> {book.averageRating} </div>
                                <div> ({book.totalRating} ratings) </div>
                            </div>
                            <div className="flex items-center w-1/2 text-[#032b41] font-medium text-sm gap-x-2">
                                <div> <Clock10Icon size={20} /> </div>
                                <div> 04:40 </div>
                            </div>
                            <div className="flex items-center w-1/2 text-[#032b41] font-medium text-sm gap-x-2">
                                <div> <MicIcon size={20} /> </div>
                                <div>  {book.type} </div>
                            </div>
                            <div className="flex items-center w-1/2 text-[#032b41] font-medium text-sm gap-x-2">
                                <div> <LightbulbIcon size={20} /> </div>
                                <div> {book.keyIdeas} </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mb-6">
                        <Link
                            href="#"
                            onClick={handleReadListenClick}
                            className="flex items-center justify-center w-[144px] h-12 bg-[#032b41] text-white rounded-[4px] cursor-pointer gap-3 transition-opacity duration-300 hover:opacity-80"
                        >
                            <div className="text-white"> <BookOpenIcon size={24} /> </div>
                            <div className="text-white"> Read </div>
                        </Link>
                        <Link
                            href="#"
                            onClick={handleReadListenClick}
                            className="flex items-center justify-center w-[144px] h-12 bg-[#032b41] text-white rounded-[4px] cursor-pointer gap-2 transition-opacity duration-300 hover:opacity-80"
                        >
                            <div className="text-white"> <MicIcon size={24} /> </div>
                            <div className="text-white"> Listen </div>
                        </Link>
                    </div>
                    {isBookInLibrary ? (
                        <div
                            onClick={() => handleRemoveFromLibrary()}
                            className="flex items-center gap-2 text-[#0365f2] font-medium cursor-pointer  text-lg transition-colors duration-200 hover:text-[#0356cc] mb-10">
                            <div>
                                <BookmarkPlusIcon />
                            </div>
                            <div>In My Library</div>
                        </div>
                    ) : (
                        <div
                            onClick={() => handleAddToLibrary()}
                            className={`flex items-center gap-2 text-[#0365f2] font-medium cursor-pointer  text-lg transition-colors duration-200 hover:text-[#0356cc] mb-10`}>
                            <div>
                                <BookmarkIcon />
                            </div>
                            <div>Add title to My Library</div>
                        </div>
                    )}
                    <h1 className="text-[#032b41] text-lg mb-4 font-semibold">Whats it about?</h1>
                    <div className="flex flex-wrap gap-4 mb-4">
                        {book.tags.map((tag, index) => <div key={index} className="bg-[#f1f6f4] px-4 h-12 flex items-center cursor-not-allowed text-[#032b41] font-medium rounded-[4px] transition-colors duration-200">
                            {tag}
                        </div>
                        )}
                    </div>
                    <div className="text-[#032b41] mb-4">
                        <p>&quot;{book.bookDescription}&quot;</p>
                    </div>
                    <h1 className="text-lg text-[#032b41] mb-4 font-semibold">About the author</h1>
                    <div className="text-[#032b41] mb-4">
                        <p>&quot;{book.authorDescription}&quot;</p>
                    </div>
                </div>
                <div>
                    <div className="h-[300px] w-[300px] min-w-[300px]">
                        <Image
                            width={300}
                            height={300}
                            src={book.imageLink}
                            alt="Book Image"
                            className="size-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}