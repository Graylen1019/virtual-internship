import { useState } from 'react';
import { RiForward10Fill, RiReplay10Fill } from 'react-icons/ri';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';

interface ControlsProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  book: { audioLink: string }; // Only need audioLink
}

export const Controls = ({ audioRef }: ControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const replay10 = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  const forward10 = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
  };

  return (
    <div className="w-1/3 flex items-center justify-center gap-6">
      <button onClick={replay10}>
        <RiReplay10Fill size={28} color="white" />
      </button>
      <button onClick={togglePlay}>
        {isPlaying ? <FaPauseCircle size={40} color="white" /> : <FaPlayCircle size={40} color="white" />}
      </button>
      <button onClick={forward10}>
        <RiForward10Fill size={28} color="white" />
      </button>
    </div>
  );
};
