"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { PlayCircleIcon, StarIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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

const ForYouSkeleton = () => (
    <div className="w-full max-w-[802px] lg:max-w-[1070px] mx-auto px-6 py-10 overflow-x-hidden">
        <h2 className="text-[22px] font-bold mb-4 text-[#032b41]">Selected just for you</h2>
        <Skeleton className="p-6 mb-6 w-full xl:w-2/3 h-[188px]" />

        <h1 className="text-[22px] font-bold text-[#032b41] mb-4">Recommended For You</h1>
        <h1 className="font-light text-[#394547] mb-4">We think you&apos;ll like these</h1>
        <Carousel className="mb-8">
            <CarouselContent className="flex gap-3 pl-3">
                {Array(5)
                    .fill(0)
                    .map((_, i) => (
                        <CarouselItem key={i} className="ml-3 mt-1.5 max-w-[200px] w-full rounded-sm">
                            <Skeleton className="w-[172px] h-[172px] mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-3 w-1/2 mb-1" />
                            <Skeleton className="h-12 w-full mb-1" />
                        </CarouselItem>
                    ))}
            </CarouselContent>
        </Carousel>

        <h1 className="text-[22px] font-bold text-[#032b41] mb-4">Suggested Books</h1>
        <h1 className="font-light text-[#394547] mb-4">Browse these books</h1>
        <Carousel className="mb-8 snap-x pl-3">
            <CarouselContent className="flex gap-3">
                {Array(5)
                    .fill(0)
                    .map((_, i) => (
                        <CarouselItem key={i} className="ml-3 mt-1.5 max-w-[200px] w-full rounded-sm">
                            <Skeleton className="w-[172px] h-[172px] mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-3 w-1/2 mb-1" />
                            <Skeleton className="h-12 w-full mb-1" />
                        </CarouselItem>
                    ))}
            </CarouselContent>
        </Carousel>
    </div>
);

interface BookCardProps {
    book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [duration, setDuration] = useState<number>(0);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => setDuration(audio.duration);

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, []);

    return (
        <div className="relative flex bg-[#fbefd6] rounded-xs flex-col md:flex-row gap-3 p-6 mb-6 w-full xl:w-2/3 justify-around">
            <audio ref={audioRef} src={book.audioLink} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} />
            <div className="w-full md:w-[35%] text-[#032b41] flex-shrink-0">
                <h1 className="max-md:text-[14px]">{book.subTitle}</h1>
            </div>
            <div className="w-[1px] bg-[#bac8ce] mr-6" />
            <div className="flex gap-4 w-[60%]">
                <div className="flex-shrink-0">
                    <Image
                        width={140}
                        height={140}
                        src={book.imageLink}
                        alt={book.title}
                        className="w-[140px] h-[140px]"
                        onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/400x200/cccccc/333333?text=No+Image`;
                        }}
                    />
                </div>
                <div className="w-full flex flex-col justify-start">
                    <h3 className="font-[600] text-[#032b41] mb-1">{book.title}</h3>
                    <h1 className="text-sm text-[#394547] mb-4">{book.author}</h1>
                    <div className="flex items-center gap-2">
                        <PlayCircleIcon color="black" size={32} />
                        <h1 className="text-sm font-medium text-[#032b41]">{formatTime(duration)}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface BookCarouselProps {
    books: Book[];
}

const BookCarousel = ({ books }: BookCarouselProps) => {
    const [durations, setDurations] = useState<{ [key: string]: number }>({}); // bookId -> duration

    useEffect(() => {
        books.forEach((book) => {
            const audio = new Audio(book.audioLink);
            audio.addEventListener("loadedmetadata", () => {
                setDurations((prev) => ({ ...prev, [book.id]: audio.duration }));
            });
        });
    }, [books]);

    const formatTime = (time: number | undefined) => {
        if (!time) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    return (
        <Carousel className="mb-8">
            <CarouselContent className="flex gap-3 pl-3">
                {books.map((book) => (
                    <CarouselItem
                        key={book.id}
                        className="hover:bg-[#f1f6f4] relative snap-start max-w-[200px] rounded-sm block pt-8 pb-3 pr-3"
                    >
                        {book.subscriptionRequired && (
                            <div className="absolute top-0 right-0 bg-[#032b41] px-2 h-5 flex items-center text-white text-[10px] rounded-full">
                                Premium
                            </div>
                        )}
                        <Link href={`/book/${book.id}`} className="relative block rounded-sm">
                            <div className="w-full h-[172px] mb-2">
                                <Image
                                    width={172}
                                    height={172}
                                    src={book.imageLink}
                                    alt={book.title}
                                    className="object-cover w-[172px] h-[172px] rounded"
                                    onError={({ currentTarget }) =>
                                        (currentTarget.src = "https://placehold.co/172x172/cccccc/333333?text=No+Image")
                                    }
                                />
                            </div>
                            <h1 className="font-bold text-[#032b41] mb-2">{book.title}</h1>
                            <h3 className="text-sm text-[#6b757b] font-light mb-2">{book.author}</h3>
                            <h1 className="text-sm text-[#394547] mb-2">{book.subTitle}</h1>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1 text-sm font-light text-[#6b757b]">
                                    <PlayCircleIcon size={16} className="text-[#6b757b]" />
                                    <span>{formatTime(durations[book.id])}</span>
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
    );
};

export const ForYouContent = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
    const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const [selected, recommended, suggested] = await Promise.all([
                    axios.get<Book[]>("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"),
                    axios.get<Book[]>("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"),
                    axios.get<Book[]>("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"),
                ]);
                setBooks(selected.data);
                setRecommendedBooks(recommended.data);
                setSuggestedBooks(suggested.data);
            } catch (err) {
                console.error("Failed to fetch books:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllBooks();
    }, []);

    if (loading) return <ForYouSkeleton />;

    return (
        <div className="w-full max-w-[802px] lg:max-w-[1070px] mx-auto px-6 py-10 overflow-x-hidden">
            {/* Selected Books */}
            <h2 className="text-[22px] font-bold mb-4 text-[#032b41]">Selected just for you</h2>
            {books.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}

            {/* Recommended Carousel */}
            <h1 className="text-[22px] font-bold text-[#032b41] mb-4">Recommended For You</h1>
            <h1 className="font-light text-[#394547] mb-4">We think you&apos;ll like these</h1>
            <BookCarousel books={recommendedBooks} />

            {/* Suggested Carousel */}
            <h1 className="text-[22px] font-bold text-[#032b41] mb-4">Suggested Books</h1>
            <h1 className="font-light text-[#394547] mb-4">Browse these books</h1>
            <BookCarousel books={suggestedBooks} />
        </div>
    );
};
