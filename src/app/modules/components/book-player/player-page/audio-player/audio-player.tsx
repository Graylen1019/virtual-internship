import { TrackInfo } from './track-info';
import { Controls } from './controls';
import { ProgressBar } from './progress-bar';
import { useRef } from 'react';
import { useBook } from '@/hooks/use-book';
import { useParams } from 'next/navigation';

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const params = useParams<{ id: string }>();
  const { book, loading, error } = useBook(params.id);

  if (loading) return <div className="text-sm text-gray-500">Loading book...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!book) return null;

  return (
    <div className="w-full h-20 mt-auto flex items-center justify-between bg-[#042330] px-10 fixed bottom-0 z-50">
      <audio ref={audioRef} src={book.audioLink} />
      <TrackInfo book={book} />
      <Controls audioRef={audioRef} book={book} />
      <ProgressBar audioRef={audioRef} book={book} />
    </div>
  );
};
