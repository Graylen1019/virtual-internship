import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import Image from 'next/image';
import { Separator } from '@radix-ui/react-separator';

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
        <div className="w-full max-w-[1070px] mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold mb-6">Welcome to your personalized feed!</h2>
            <p className="text-gray-700">This is where you&apos;ll find content tailored just for you based on your preferences and activity.</p>
            <div className="">
                {books.map((book) => (
                    <div key={book.id} className="w-full bg-white p-6 rounded-lg shadow-md border border-gray-200 flex">
                        <div>

                            <p className="text-gray-700 text-sm">{book.subTitle}</p>
                        </div>
                            <Separator color='black'  className='h-1' />
                        <div className='flex'>

                            <Image
                                width={105}
                                height={105}
                                src={book.imageLink}
                                alt={book.title}
                                className="mt-4 w-full h-48 object-cover rounded-md"
                                onError={(e) => { e.currentTarget.src = `https://placehold.co/400x200/cccccc/333333?text=No+Image`; }}
                            />
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-blue-600">{book.title}</h3>

                                <p className="text-sm text-gray-500 mt-2">Author: {book.author}</p>
                            </div>
                        </div>
                    </div>
                ))}


            </div>
        </div>
    );
};
