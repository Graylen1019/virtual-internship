// hooks/useBook.ts
import { useState, useEffect } from "react";
import axios from "axios";

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

export function useBook(id?: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await axios.get<Book>(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
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

    fetchBook();
  }, [id]);

  return { book, loading, error };
}
