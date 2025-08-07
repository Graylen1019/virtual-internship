import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Separator } from '@radix-ui/react-separator';
import { PlayCircleIcon } from 'lucide-react';

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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get<Book[]>('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected');
                setBooks(response.data);
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

        fetchBooks();
    }, []);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <p className="text-xl text-gray-700">Loading your personalized feed...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                <p className="text-xl">Error: {error}</p>
                <p className="text-gray-700">Could not load personalized content. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1070px] mx-auto px-5 py-10">
            <h2 className="text-[22px] font-bold mb-4 text-[#032b41]">Selected just for you</h2>
            {books.map((book) => (
                <div key={book.id} className="flex justify-between bg-[#fbefd6] rounded-sm p-6 mb-6 gap-6 lg:w-2/3 w-full ">
                    <div className='w-[40%] text-[#032b41]'>

                        <p className="leading-[1.15]">{book.subTitle}</p>
                    </div>
                    <div color='black' className=' w-[1px] bg-[#bac8ce]' />
                    <div className='flex gap-4 w-[60%]'>
                        <div>

                            <Image
                                width={105}
                                height={105}
                                src={book.imageLink}
                                alt={book.title}
                                className=" min-w-[140px] w-[140px] h-[140px]"
                                onError={(e) => { e.currentTarget.src = `https://placehold.co/400x200/cccccc/333333?text=No+Image`; }}
                            />
                        </div>
                        <div className='w-full'>
                            <h3 className="font-[600] text-[#032b41] mb-1">{book.title}</h3>

                            <p className="text-sm text-[#394547] mb-4">{book.author}</p>
                            <div className='flex items-center gap-2'>
                                <PlayCircleIcon size={24} className='size-8' />
                                <p className='text-sm font-medium text-[#032b41]'>3 Mins 23 Seconds</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <h1>s</h1>
        </div>
    );
};
