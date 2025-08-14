import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { PlayCircleIcon, StarIcon } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Link from 'next/link';

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

export const ForYouContent = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
    const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const [selected, recommended, suggested] = await Promise.all([
                    axios.get<Book[]>('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'),
                    axios.get<Book[]>('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
                    axios.get<Book[]>('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested'),
                ]);

                setBooks(selected.data);
                setRecommendedBooks(recommended.data);
                setSuggestedBooks(suggested.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response) {
                    setError(`HTTP error! status: ${err.response.status} - ${err.response.statusText}`);
                } else {
                    setError("Unknown error");
                }
                console.error("Failed to fetch books:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllBooks();
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl text-gray-700">Loading your personalized feed...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <h1 className="text-xl">Error: {error}</h1>
                <h1 className="text-gray-700">Could not load personalized content. Please try again later.</h1>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[802px] lg:max-w-[1070px] mx-auto px-6 py-10 overflow-x-hidden">
            {/* Selected Books */}
            <h2 className="text-[22px] font-bold mb-4 text-[#032b41]">Selected just for you</h2>
            {books.map((book) => (
                <div key={book.id} className=" relative flex bg-[#fbefd6] rounded-xs flex-col md:flex-row gap-3 p-6 mb-6 w-full xl:w-2/3 justify-around">
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
                                onError={(e) => { e.currentTarget.src = `https://placehold.co/400x200/cccccc/333333?text=No+Image`; }}
                            />
                        </div>
                        <div className="w-full flex flex-col justify-start">
                            <h3 className="font-[600] text-[#032b41] mb-1">{book.title}</h3>
                            <h1 className="text-sm text-[#394547] mb-4">{book.author}</h1>
                            <div className="flex items-center gap-2">
                                <PlayCircleIcon color="black" size={32} />
                                <h1 className="text-sm font-medium text-[#032b41]">3 Mins 23 Secs</h1>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Recommended Carousel */}
            <h1 className="text-[22px] font-bold text-[#032b41] mb-4">Recommended For You</h1>
            <h1 className="font-light text-[#394547] mb-4">We think you&apos;ll like these</h1>
            <Carousel className="mb-8">
                <CarouselContent className="flex gap-3 pl-3">
                    {recommendedBooks.map((book) => (
                        <CarouselItem key={book.id} className="relative snap-start max-w-[200px] rounded-sm block pt-8 pb-3 pr-3 ">
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
                                            (currentTarget.src =
                                                "https://placehold.co/172x172/cccccc/333333?text=No+Image")
                                        }
                                    />
                                </div>
                                <h1 className="font-bold text-[#032b41] mb-2">{book.title}</h1>
                                <h3 className="text-sm text-[#6b757b] font-light mb-2">{book.author}</h3>
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

            {/* Suggested Carousel */}
            <h1 className="text-[22px] font-bold text-[#032b41] mb-4">Suggested Books</h1>
            <h1 className="font-light text-[#394547] mb-4">Browse these books</h1>
            <Carousel className="mb-8 snap-x pl-3">
                <CarouselContent className="flex gap-3 ">
                    {suggestedBooks.map((book) => (
                        <CarouselItem key={book.id} className="relative snap-start max-w-[200px] rounded-sm block pt-8 pb-3 pr-3 ">
                                {book.subscriptionRequired && (
                                    <div className="absolute top-0 right-0 bg-[#032b41] px-2 h-5 flex items-center text-white text-[10px] rounded-full">
                                        Premium
                                    </div>
                                )}
                            <Link href={`/book/${book.id}`} className="">
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
                                <h1 className="font-bold text-[#032b41] mb-2">{book.title}</h1>
                                <h3 className="text-sm text-[#6b757b] font-light mb-2">{book.author}</h3>
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
    );
};
