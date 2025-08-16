import { useState, useEffect } from "react";

interface ProgressBarProps {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    book: { audioLink: string };
}

export const ProgressBar = ({ audioRef }: ProgressBarProps) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!isNaN(audio.duration) && audio.duration > 0) setDuration(audio.duration);

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [audioRef]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setCurrentTime(Number(e.target.value));
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="w-1/3 flex items-center gap-4">
            <div className="text-sm text-white">{formatTime(currentTime)}</div>
            <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                style={{
                    background: `linear-gradient(to right, #2bd97c 0%, #2bd97c ${progressPercent}%, #6D787D ${progressPercent}%, #6D787D 100%)`,
                }}
                className="
    w-full
    h-1
    rounded-[8px]
    cursor-pointer
    appearance-none
    outline-none
  "
            />

            <div className="text-sm text-white">{formatTime(duration)}</div>
        </div>
    );
};
