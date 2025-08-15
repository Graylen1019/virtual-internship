"use client";

import { useModal } from "@/app/context/modal-context";
import { db } from "@/app/lib/utils/firebase-client";
import axios from "axios";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { StarIcon, Clock10Icon, MicIcon, LightbulbIcon, BookOpenIcon, BookmarkIcon, BookmarkPlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const { openSignInModal } = useModal();
    const auth = getAuth();

    const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBookInLibrary, setIsBookInLibrary] = useState(false);
    const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [duration, setDuration] = useState(0);

    // Auth listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, [auth]);

    // Fetch book & user info
    useEffect(() => {
        if (!params.id) return;

        const fetchBook = async () => {
            try {
                const res = await axios.get<Book>(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`);
                setBook(res.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response) {
                    setError(`HTTP error! status: ${err.response.status} - ${err.response.statusText}`);
                } else {
                    setError("Unknown error");
                }
                console.error("Failed to fetch book:", err);
            } finally {
                setLoading(false);
            }
        };

        const checkLibraryStatus = async (userId: string, bookId: string) => {
            const bookDocRef = doc(db, "users", userId, "myBooks", bookId);
            const snap = await getDoc(bookDocRef);
            setIsBookInLibrary(snap.exists());
        };

        const fetchUserSubscription = async (userId: string) => {
            const userDocRef = doc(db, "users", userId);
            const snap = await getDoc(userDocRef);
            if (snap.exists()) setUserSubscriptionStatus(snap.data().subscriptionStatus);
        };

        fetchBook();
        if (currentUser) {
            checkLibraryStatus(currentUser.uid, params.id);
            fetchUserSubscription(currentUser.uid);
        }
    }, [params.id, currentUser]);

    // Audio duration
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Metadata may already be loaded
        if (!isNaN(audio.duration) && audio.duration > 0) setDuration(audio.duration);

        const handleLoadedMetadata = () => setDuration(audio.duration);

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [audioRef]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const handleAddToLibrary = async () => {
        if (!book) return openSignInModal();
        if (!currentUser) return openSignInModal();

        try {
            const userDocRef = doc(db, "users", currentUser.uid);
            await setDoc(userDocRef, { email: currentUser.email, lastActive: serverTimestamp() }, { merge: true });

            const bookDocRef = doc(userDocRef, "myBooks", book.id);
            await setDoc(bookDocRef, { ...book, addedAt: serverTimestamp() });

            setIsBookInLibrary(true);
        } catch (err) {
            console.error("Failed to add book to library:", err);
        }
    };

    const handleRemoveFromLibrary = async () => {
        if (!book || !currentUser) return;

        try {
            const bookDocRef = doc(db, "users", currentUser.uid, "myBooks", book.id);
            await deleteDoc(bookDocRef);
            setIsBookInLibrary(false);
        } catch (err) {
            console.error("Failed to remove book from library:", err);
        }
    };

    const handleReadListenClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!currentUser) return openSignInModal();
        if (book?.subscriptionRequired && userSubscriptionStatus !== "premium") {
            router.push("/choose-plan");
        } else {
            router.push(`/player/${book?.id}`);
        }
    };

    // --- Render Loading / Error / Content ---
    if (loading) {
        return (
            <div className="max-w-5xl w-full mx-auto px-6 py-10 flex gap-8">
                <div className="flex-1">
                    <Skeleton className="h-8 w-2/3 mb-4" />
                    <Skeleton className="h-5 w-1/3 mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-4" />
                    <div className="border-t border-b border-[#e1e7ea] py-4 mb-6">
                        <div className="flex flex-wrap max-w-[400px] gap-y-3">
                            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-4 w-40" />)}
                        </div>
                    </div>
                    <div className="flex gap-4 mb-6">
                        <Skeleton className="h-12 w-40" />
                        <Skeleton className="h-12 w-40" />
                    </div>
                    <Skeleton className="h-4 w-40 mb-8" />
                    <Skeleton className="h-[300px] w-full mb-8" />
                    <Skeleton className="h-[300px] w-full" />
                </div>
                <Skeleton className="w-[300px] h-[300px]" />
            </div>
        );
    }

    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!book) return <div className="p-8 text-center text-gray-700">No book found.</div>;

    return (
        <div className="max-w-5xl w-full mx-auto px-6 py-10">
            <audio ref={audioRef} src={book.audioLink} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} />
            <div className="flex gap-4">
                <div className="w-full">
                    <h1 className="text-[#032b41] mb-4 font-semibold text-2xl">
                        {book.title} {book.subscriptionRequired && "(Premium)"}
                    </h1>
                    <p className="text-[#032b41] mb-4 font-semibold">{book.author}</p>
                    <p className="text-xl text-[#032b41] mb-4 font-light">{book.subTitle}</p>

                    <div className="border-t-[1px] border-[#e1e7ea] border-b-[1px] py-4 mb-6">
                        <div className="flex flex-wrap max-w-[400px] gap-y-3">
                            <div className="flex items-center w-1/2 text-[#032b41] font-medium text-sm gap-x-2">
                                <StarIcon size={20} />
                                {book.averageRating} ({book.totalRating} ratings)
                            </div>
                            <div className="flex items-center w-1/2 text-[#032b41] font-medium text-sm gap-x-2">
                                <Clock10Icon size={20} /> {formatTime(duration)}
                            </div>
                            <div className="flex items-center w-1/2 text-[#032b41] font-medium text-sm gap-x-2">
                                <MicIcon size={20} /> {book.type}
                            </div>
                            <div className="flex items-center w-1/2 text-[#032b41] font-medium text-sm gap-x-2">
                                <LightbulbIcon size={20} /> {book.keyIdeas}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <Link href="#" onClick={handleReadListenClick} className="flex items-center justify-center w-[144px] h-12 bg-[#032b41] text-white rounded gap-3 hover:opacity-80">
                            <BookOpenIcon color="white" size={24} />  <div className="text-white">Read</div>
                        </Link>
                        <Link href="#" onClick={handleReadListenClick} className="flex items-center justify-center w-[144px] h-12 bg-[#032b41] text-white rounded gap-2 hover:opacity-80">
                            <MicIcon size={24} color="white" /> <div className="text-white">Listen</div>
                        </Link>
                    </div>

                    {isBookInLibrary ? (
                        <div onClick={handleRemoveFromLibrary} className="flex items-center gap-2 text-[#0365f2] font-medium cursor-pointer mb-10 hover:text-[#0356cc]">
                            <BookmarkPlusIcon /> In My Library
                        </div>
                    ) : (
                        <div onClick={handleAddToLibrary} className="flex items-center gap-2 text-[#0365f2] font-medium cursor-pointer mb-10 hover:text-[#0356cc]">
                            <BookmarkIcon /> Add title to My Library
                        </div>
                    )}

                    <h2 className="text-[#032b41] text-lg mb-4 font-semibold">What&apos;s it about?</h2>
                    <div className="flex flex-wrap gap-4 mb-4">
                        {book.tags.map((tag, idx) => (
                            <div key={idx} className="bg-[#f1f6f4] px-4 h-12 flex items-center text-[#032b41] font-medium rounded">{tag}</div>
                        ))}
                    </div>
                    <p className="text-[#032b41] mb-4">&quot;{book.bookDescription}&quot;</p>

                    <h2 className="text-lg text-[#032b41] mb-4 font-semibold">About the author</h2>
                    <p className="text-[#032b41] mb-4">&quot;{book.authorDescription}&quot;</p>
                </div>

                <div className="h-[300px] w-[300px] min-w-[300px]">
                    <Image width={300} height={300} src={book.imageLink} alt="Book Image" className="w-full h-full object-cover rounded" />
                </div>
            </div>
        </div>
    );
};
