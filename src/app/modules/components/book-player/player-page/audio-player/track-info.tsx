import Image from "next/image";

interface TrackInfoProps {
  book: { title: string; author: string; imageLink: string };
}

export const TrackInfo = ({ book }: TrackInfoProps) => {
  return (
    <div className="w-1/3 flex gap-3 items-center">
      <div className="flex max-w-[48px]">
        <Image
          alt="Book cover"
          src={book.imageLink}
          width={48}
          height={48}
          className="size-12 min-w-[48px]"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-white font-semibold">{book.title}</p>
        <p className="text-gray-400 text-sm">{book.author}</p>
      </div>
    </div>
  );
};
