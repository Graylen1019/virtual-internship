import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BiSearchAlt2 } from "react-icons/bi";
import { Clock10Icon } from "lucide-react";
import Link from "next/link";

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

export const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!search.trim()) {
      setBooks([]);
      return;
    }

    const debounce = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<Book[]>(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${search}`
        );
        setBooks(res.data);
      } catch (err: unknown) {
        setError("Failed to fetch books");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="relative w-full max-w-[340px]">
      {/* Input */}
      <div className="relative flex w-full items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm font-medium tracking-tight h-[40px] w-full rounded-sm border-2 border-[#e1e7ea] bg-[#f1f6f4] px-4 pr-12 text-[#042330]"
          type="text"
          placeholder="Search for books"
        />
        <div className="absolute right-0 flex h-full items-center justify-center border-l-2 border-[#e1e7ea] px-2">
          <BiSearchAlt2 size={24} />
        </div>
      </div>

      {/* Dropdown */}
      {books.length > 0 && (
        <div className="flex flex-col min-w-[440px] max-w-[440px] max-h-[640px] ml-auto overflow-y-auto p-4 absolute top-22 right-0 bg-white border border-[#e1e7ea] shadow-[0_0_6px_0_rgba(0,0,0,0.14)] z-50">
          {books.map((book) => (
            <Link
              onClick={() => setBooks([])}
              href={`/book/${book.id}`}
              key={book.id}
              className="flex items-center p-4 gap-6 h-[120px] border-b-[1px] border-[#e1e7ea] hover:bg-[#f1f6f4]"
            >
              <div className="h-20 w-20 min-w-20">
                <Image
                  src={book.imageLink || "https://placehold.co/40x60/cccccc/333333?text=No+Image"}
                  alt={book.title}
                  height={20}
                  width={20}
                  unoptimized
                  className="size-full"
                  onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/40x60/cccccc/333333?text=No+Image")
                  }
                />
              </div>
              <div className="">
                <div className="leading-tight font-medium text-[#032b41] mb-1">{book.title}</div>
                <div className="text-sm font-light text-[#6b757b] mb-1">{book.author}</div>
                <div className="flex items-center gap-1 text-sm font-light text-[#6b757b]"><Clock10Icon size={16} /> 03:24</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Loading & Error */}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};
