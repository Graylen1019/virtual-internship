import { db } from "@/app/lib/utils/firebase-client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { query, collection, getDocs } from "firebase/firestore";
import { BookmarkIcon, Link, PlayCircleIcon, StarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

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

export const LibraryPageContent  = () => {
        const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const auth = getAuth();
    // ... rest of the component
    useEffect(() => {
        const fetchMyBooks = async (userId: string) => {
            setLoading(true);
            setError(null);
            try {
                const q = query(collection(db, "users", userId, "myBooks"));
                const querySnapshot = await getDocs(q);
                const fetchedBooks: Book[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedBooks.push({ id: doc.id, ...doc.data() } as Book);
                });
                setBooks(fetchedBooks);
            } catch (err) {
                console.error("Failed to fetch books:", err);
                setError("Failed to load your library. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchMyBooks(user.uid);
            } else {
                setBooks([]);
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, []);

    // ... inside MyLibraryPage component

    if (loading) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <p className="text-xl text-gray-700">Loading your library...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full w-full flex justify-center items-center text-red-600">
                <p className="text-xl">Error: {error}</p>
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center text-gray-700 p-8">
                <BookmarkIcon size={48} className="mb-4" />
                <p className="text-xl font-semibold mb-2">No saved books found</p>
                <p className="text-md text-center">
                    Head to the homepage to discover new titles and add them to your library.
                </p>
            </div>
        );
    }
    return ( 
        <div className="w-full px-6 py-10 max-w-[1070px] mx-auto">
            <h1 className="text-2xl font-bold text-[#032b41] mb-4">Saved Books</h1>
            <h1 className="font-light text-[#394547] mb-4">{books.length} items</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <Carousel>
                    <CarouselContent>
                        {books.map((book) => (
                            <CarouselItem
                                key={book.id}
                                className="ml-3 mt-1.5 max-w-[200px] w-full rounded-sm"
                            >
                                <Link href={`/book/${book.id}`} className="relative block rounded-sm pt-8 pb-2 mr-2">
                                    {book.subscriptionRequired && (
                                        <div className="absolute top-0 right-0 bg-[#032b41] px-2 h-5 flex items-center text-white text-[10px] rounded-full">
                                            Premium
                                        </div>
                                    )}
                                    <Image
                                        width={172}
                                        height={172}
                                        src={book.imageLink}
                                        alt={book.title}
                                        className="object-cover w-[172px] h-[172px] rounded"
                                        onError={(
                                            e: React.SyntheticEvent<HTMLImageElement, Event>
                                        ) => {
                                            e.currentTarget.src =
                                                "https://placehold.co/172x172/cccccc/333333?text=No+Image";
                                        }}
                                    />
                                    <h1 className="font-bold text-[#032b41] mb-1 ">
                                        {book.title}
                                    </h1>
                                    <h3 className="text-sm text-[#6b757b] font-light mb-1">
                                        {book.author}
                                    </h3>
                                    <h1 className="text-sm text-[#394547] mb-2">{book.subTitle}</h1>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1 text-sm font-light text-[#6b757b]">
                                            <PlayCircleIcon size={16} className="text-[#6b757b]" />
                                            <span>sss</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-light text-[#6b757b]">
                                            <StarIcon size={16} />
                                            <span>{book.averageRating}</span>
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

            </div>
        </div>
    );
}