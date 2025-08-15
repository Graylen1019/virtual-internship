"use client"

import axios from "axios";
import { getAuth } from "firebase/auth";
import { Loader2Icon, LoaderPinwheelIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Book {
    id: string;
    title: string;
    summary: string;
}

export const PlayerPageContent = () => {
    const params = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

        if (params.id) {
            fetchBook();
        }
    }, [params.id, auth.currentUser]);

    if (loading) {
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                <Loader2Icon size={64} className="animate-spin" />
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
        <div className="relative w-full h-[calc(100vh - 160px)] flex flex-col">
            <div className="whitespace-pre-line py-10 px-6 max-w-[800px] mx-auto">
                <h1 className="text-[#032b41] text-2xl border-b-[1px] mb-8 pb-4 font-bold">{book.title}</h1>
                <div className="whitespace-pre-line leading-snug text-[#032b41]">{book.summary}</div>
            </div>
        </div>
    );
};