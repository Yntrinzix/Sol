import { useCallback, useEffect, useRef } from 'react';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    isPlaying.current = false;
  }, []);

  const play = useCallback((clipId: string) => {
    stop();
    const audio = new Audio(`/audio/${clipId}.mp3`);
    audioRef.current = audio;
    audio.play().then(() => { isPlaying.current = true; }).catch(() => { isPlaying.current = false; });
    audio.onended = () => { isPlaying.current = false; };
  }, [stop]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return { play, stop, isPlaying };
}
