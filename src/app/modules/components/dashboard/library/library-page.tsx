import { db } from "@/app/lib/utils/firebase-client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { query, collection, getDocs } from "firebase/firestore";
import { BookmarkIcon, PlayCircleIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { BookPageContent } from "../../book-player/book-page/book-page";
import { NoUserContent } from "../auth";

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

const LibraryPageContentSkeleton = () => {
    return (
        <div className="w-full px-6 py-10 max-w-[1070px] mx-auto">
            <h1 className="text-2xl font-bold text-[#032b41] mb-4">Saved Books</h1>
            <div className="w-full mb-4">
                <Skeleton className="h-4 w-16" />
            </div>
            <Carousel className="mb-6">
                <CarouselContent>
                    {new Array(3).fill(0).map((_, index) => (

                        <CarouselItem
                            key={index}
                            className="ml-3 mt-1.5 max-w-[200px] w-full rounded-sm"
                        >
                            <div className="relative block rounded-sm pt-8 pb-2 mr-2">

                                <div className="w-full h-[172px] mb-2">
                                    <Skeleton className="w-[172px] h-[172px]" />
                                </div>
                                <div className="w-full mb-3">

                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <div className="w-full mb-3">

                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <div className="w-full mb-3">

                                    <Skeleton className="h-12 w-full" />
                                </div>

                                <div className="flex gap-2">
                                    <Skeleton className="w-1/2 h-3" />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export const LibraryPageContent = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>();
    const [error, setError] = useState<string | null>(null);

    const auth = getAuth();
    // ... rest of the component
    useEffect(() => {
        const fetchMyBooks = async (userId: string) => {
            const currentUser = auth.currentUser;
            if (currentUser) {
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
            } else {
                // Handle the case where there is no authenticated user
                setLoading(false)
                setError(`boop`)
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
    }, [auth]);

    if (loading) return <LibraryPageContentSkeleton />
    if (!auth.currentUser) return <NoUserContent />

    return (
        <div className="w-full px-6 py-10 max-w-[1070px] mx-auto">
            <h1 className="text-2xl font-bold text-[#032b41] mb-4">Saved Books</h1>
            <h1 className="font-light text-[#394547] mb-4">{books.length} items</h1>
            <Carousel className="mb-6">
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
                                <div className="w-full h-[172px] mb-2">
                                    <Image
                                        width={172}
                                        height={172}
                                        src={book.imageLink}
                                        alt={book.title}
                                        className="object-cover w-[172px] h-[172px] rounded"
                                        onError={({ currentTarget }) =>
                                        (currentTarget.src =
                                            "https://placehold.co/172x172/cccccc/333333?text=No+Image")
                                        }
                                    />
                                </div>
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
    )
}