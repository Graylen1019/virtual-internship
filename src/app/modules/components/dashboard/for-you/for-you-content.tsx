import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { PlayCircleIcon, StarIcon } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
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
        <div className="w-full max-w-[742px] lg:max-w-[882px] xl:max-w-[1070px] mx-auto px-6 py-9.5">
            <h2 className=" text-[22px] font-bold mb-2.5 text-[#032b41]">Selected just for you</h2>
            {books.map((book) => (
                <div key={book.id} className="flex bg-[#fbefd6] rounded-xs max-md:flex-col max-md:gap-3 p-6 mb-5.5 w-full xl:w-2/3">
                    <div className='w-full md:w-2/5 lg:w-1/3 text-[#032b41] flex-shrink-0'>
                        <h1 className=" max-md:text-[14px]">{book.subTitle}</h1>
                    </div>
                    <div className='w-[1px] bg-[#bac8ce] ml-1 mr-6 md:ml-10' />
                    <div className='flex gap-4 w-full '>
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
                        <div className='w-full flex flex-col justify-start'>
                            <h3 className="font-[600] text-[#032b41] mb-1">{book.title}</h3>
                            <h1 className="text-sm text-[#394547] mb-4">{book.author}</h1>
                            <div className='flex items-center gap-2'>
                                <PlayCircleIcon color='black' size={32} className='size-10' />
                                <h1 className='text-sm font-medium text-[#032b41]'>3 Mins 23 Secs</h1>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <h1 className='text-[22px] font-bold text-[#032b41] mb-2.5'>Recommended For You</h1>
            <h1 className='font-light text-[#394547] mb-2.5'>We think you&apos;ll like these</h1>
            <Carousel className="mb-6">
                <CarouselContent>
                    {recommendedBooks.map((book) => (
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
            <h1 className='text-[22px] font-bold text-[#032b41] mb-2.5'>Suggested Books</h1>
            <h1 className='font-light text-[#394547] mb-2.5'>Browse these books</h1>
            <Carousel className='mb-5.5'>
                <CarouselContent>
                    {suggestedBooks.map((book) => (
                       <CarouselItem
                            key={book.id}
                            className="ml-3 mt-1.5 max-w-[200px] w-full rounded-sm"
                        >
                            <Link href="/" className="relative block rounded-sm pt-8 pb-2 mr-2">
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
    );
};