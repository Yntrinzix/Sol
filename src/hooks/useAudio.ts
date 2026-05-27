import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback((clipId: string) => {
    stop();
    const audio = new Audio(`/audio/${clipId}.mp3`);
    audioRef.current = audio;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    audio.onended = () => setIsPlaying(false);
  }, [stop]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return { play, stop, isPlaying };
}
