
import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  duration: number;
  currentTime: number;
  progress: number;
  playAudio: (url: string, title?: string) => void;
  pauseAudio: () => void;
  stopAudio: () => void;
  seekAudio: (time: number) => void;
  togglePlayPause: () => void;
  audioTitle: string | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [audioTitle, setAudioTitle] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          setProgress(audioRef.current.currentTime / audioRef.current.duration * 100);
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  const playAudio = (url: string, title?: string) => {
    if (audioRef.current) {
      // If already playing a different track, stop current one first
      if (currentTrack && currentTrack !== url) {
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.currentTime = 0;
      }
      
      // If it's a new track or no track was playing
      if (!currentTrack || currentTrack !== url) {
        audioRef.current.src = url;
      }
      
      // Play and update state
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setCurrentTrack(url);
          if (title) {
            setAudioTitle(title);
          }
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  };
  
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    }
  };
  
  const seekAudio = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else if (currentTrack) {
      playAudio(currentTrack, audioTitle || undefined);
    }
  };
  
  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        duration,
        currentTime,
        progress,
        playAudio,
        pauseAudio,
        stopAudio,
        seekAudio,
        togglePlayPause,
        audioTitle,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
