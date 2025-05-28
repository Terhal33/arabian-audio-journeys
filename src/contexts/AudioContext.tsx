import React, { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export interface AudioTrack {
  id: string;
  url: string;
  title: string;
  tourId?: string;
  duration?: number;
  isPremium?: boolean;
}

export interface PlaybackSettings {
  preferredQuality: 'standard' | 'high';
  autoplay: boolean;
}

export interface TourProgress {
  [tourId: string]: {
    lastPosition: number;
    completedSegments: string[];
    totalDuration: number;
  };
}

interface AudioContextType {
  // Audio state
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  progress: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  
  // Queue and history
  queue: AudioTrack[];
  playbackHistory: AudioTrack[];
  
  // Timer state
  sleepTimerActive: boolean;
  sleepTimerRemaining: number | null;
  
  // UI state
  isMiniPlayerActive: boolean;
  
  // Settings
  playbackSettings: PlaybackSettings;
  
  // Tour progress tracking
  tourProgress: TourProgress;
  trackProgress: { [trackId: string]: number };
  
  // Audio controls
  playAudio: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  seekAudio: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlaybackRate: () => void;
  
  // Queue management
  addToQueue: (track: AudioTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  
  // Timer controls
  startSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
  
  // UI controls
  showMiniPlayer: () => void;
  hideMiniPlayer: () => void;
  
  // Settings
  updatePlaybackSettings: (settings: Partial<PlaybackSettings>) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  // Audio state
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  
  // Queue and history
  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [playbackHistory, setPlaybackHistory] = useState<AudioTrack[]>([]);
  
  // Timer state
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  
  // UI state
  const [isMiniPlayerActive, setIsMiniPlayerActive] = useState(false);
  
  // Settings
  const [playbackSettings, setPlaybackSettings] = useState<PlaybackSettings>({
    preferredQuality: 'standard',
    autoplay: true
  });
  
  // Progress tracking
  const [tourProgress, setTourProgress] = useState<TourProgress>({});
  const [trackProgress, setTrackProgress] = useState<{ [trackId: string]: number }>({});
  
  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressUpdateRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    console.log('AudioContext: Initializing audio element');
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
      const audio = audioRef.current;
      
      // Set up event listeners
      const handleLoadedMetadata = () => {
        console.log('Audio: Metadata loaded, duration:', audio.duration);
        setDuration(audio.duration || 0);
      };
      
      const handleTimeUpdate = () => {
        const current = audio.currentTime || 0;
        const dur = audio.duration || 0;
        const prog = dur > 0 ? (current / dur) * 100 : 0;
        
        setCurrentTime(current);
        
        // Update track progress
        if (currentTrack) {
          setTrackProgress(prev => ({
            ...prev,
            [currentTrack.id]: current
          }));
          
          // Update tour progress if part of a tour
          if (currentTrack.tourId) {
            setTourProgress(prev => ({
              ...prev,
              [currentTrack.tourId!]: {
                ...prev[currentTrack.tourId!],
                lastPosition: current,
                totalDuration: dur
              }
            }));
          }
        }
      };
      
      const handleCanPlay = () => {
        console.log('Audio: Can play, attempting to start playback');
        if (isPlaying) {
          audio.play().catch(error => {
            console.error('Audio: Auto-play failed:', error);
            setIsPlaying(false);
          });
        }
      };
      
      const handlePlay = () => {
        console.log('Audio: Play event fired');
        setIsPlaying(true);
      };
      
      const handlePause = () => {
        console.log('Audio: Pause event fired');
        setIsPlaying(false);
      };
      
      const handleEnded = () => {
        console.log('Audio: Track ended');
        setIsPlaying(false);
        
        // Mark segment as completed
        if (currentTrack) {
          if (currentTrack.tourId) {
            setTourProgress(prev => ({
              ...prev,
              [currentTrack.tourId!]: {
                ...prev[currentTrack.tourId!],
                completedSegments: [
                  ...(prev[currentTrack.tourId!]?.completedSegments || []),
                  currentTrack.id
                ].filter((id, index, arr) => arr.indexOf(id) === index) // Remove duplicates
              }
            }));
          }
          
          // Auto-play next if enabled
          if (playbackSettings.autoplay && queue.length > 0) {
            playNext();
          }
        }
      };
      
      const handleError = (e: Event) => {
        console.error('Audio: Error occurred', e);
        setIsPlaying(false);
        toast({
          title: 'Playback Error',
          description: 'Unable to play the audio track. Please try again.',
          variant: 'destructive',
        });
      };
      
      // Add event listeners
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      // Set initial volume and playback rate
      audio.volume = volume;
      audio.playbackRate = playbackRate;
      
      return () => {
        // Cleanup event listeners
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [isPlaying, playbackSettings.autoplay, queue, currentTrack, volume, playbackRate]);

  // Update audio volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update audio playback rate when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Calculate progress
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Play audio function
  const playAudio = useCallback((track: AudioTrack) => {
    console.log('AudioContext: Playing track:', track.title, 'URL:', track.url);
    
    if (!audioRef.current) {
      console.error('AudioContext: Audio element not initialized');
      return;
    }

    // Set the new track
    setCurrentTrack(track);
    
    // Load the audio source
    audioRef.current.src = track.url;
    audioRef.current.load();
    
    // Reset current time
    setCurrentTime(0);
    
    // Add to history if not already there
    setPlaybackHistory(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 20); // Keep last 20 tracks
    });
    
    // Show mini player
    setIsMiniPlayerActive(true);
    
    // Play when ready
    const playWhenReady = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            console.log('AudioContext: Playback started successfully');
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('AudioContext: Playback failed:', error);
            setIsPlaying(false);
            toast({
              title: 'Playback Error',
              description: 'Unable to start playback. Please try again.',
              variant: 'destructive',
            });
          });
      }
    };
    
    // Wait for the audio to be ready
    if (audioRef.current.readyState >= 2) {
      playWhenReady();
    } else {
      audioRef.current.addEventListener('canplay', playWhenReady, { once: true });
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    console.log('AudioContext: Toggle play/pause, current state:', isPlaying);
    
    if (!audioRef.current || !currentTrack) {
      console.log('AudioContext: No audio element or current track');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .then(() => {
          console.log('AudioContext: Resume playback successful');
        })
        .catch((error) => {
          console.error('AudioContext: Resume playback failed:', error);
          toast({
            title: 'Playback Error',
            description: 'Unable to resume playback. Please try again.',
            variant: 'destructive',
          });
        });
    }
  }, [isPlaying, currentTrack]);

  // Seek audio
  const seekAudio = useCallback((time: number) => {
    console.log('AudioContext: Seeking to time:', time);
    
    if (!audioRef.current) {
      console.log('AudioContext: No audio element for seeking');
      return;
    }

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    console.log('AudioContext: Setting volume to:', newVolume);
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  }, [isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    console.log('AudioContext: Toggling mute, current state:', isMuted);
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Skip forward
  const skipForward = useCallback((seconds: number = 10) => {
    console.log('AudioContext: Skipping forward by:', seconds, 'seconds');
    
    if (!audioRef.current) return;
    
    const newTime = Math.min(audioRef.current.currentTime + seconds, duration);
    seekAudio(newTime);
  }, [duration, seekAudio]);

  // Skip backward
  const skipBackward = useCallback((seconds: number = 10) => {
    console.log('AudioContext: Skipping backward by:', seconds, 'seconds');
    
    if (!audioRef.current) return;
    
    const newTime = Math.max(audioRef.current.currentTime - seconds, 0);
    seekAudio(newTime);
  }, [seekAudio]);

  // Play next track in queue
  const playNext = useCallback(() => {
    console.log('AudioContext: Playing next track, queue length:', queue.length);
    
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(prev => prev.slice(1));
      playAudio(nextTrack);
    }
  }, [queue, playAudio]);

  // Play previous track
  const playPrevious = useCallback(() => {
    console.log('AudioContext: Playing previous track');
    
    if (playbackHistory.length > 1) {
      const previousTrack = playbackHistory[1];
      playAudio(previousTrack);
    }
  }, [playbackHistory, playAudio]);

  // Set playback rate
  const setPlaybackRate = useCallback((rate: number) => {
    console.log('AudioContext: Setting playback rate to:', rate);
    setPlaybackRateState(rate);
  }, []);

  // Queue management
  const addToQueue = useCallback((track: AudioTrack) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setQueue(prev => prev.filter(track => track.id !== trackId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Sleep timer functions
  const startSleepTimer = useCallback((minutes: number) => {
    console.log('AudioContext: Starting sleep timer for:', minutes, 'minutes');
    
    setSleepTimerActive(true);
    setSleepTimerRemaining(minutes * 60);
    
    sleepTimerRef.current = setInterval(() => {
      setSleepTimerRemaining(prev => {
        if (prev === null || prev <= 1) {
          // Timer finished
          setSleepTimerActive(false);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const cancelSleepTimer = useCallback(() => {
    console.log('AudioContext: Cancelling sleep timer');
    
    setSleepTimerActive(false);
    setSleepTimerRemaining(null);
    
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
  }, []);

  // UI controls
  const showMiniPlayer = useCallback(() => {
    setIsMiniPlayerActive(true);
  }, []);

  const hideMiniPlayer = useCallback(() => {
    setIsMiniPlayerActive(false);
  }, []);

  // Settings
  const updatePlaybackSettings = useCallback((settings: Partial<PlaybackSettings>) => {
    setPlaybackSettings(prev => ({ ...prev, ...settings }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
      if (progressUpdateRef.current) {
        clearInterval(progressUpdateRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const contextValue: AudioContextType = {
    // Audio state
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    progress,
    volume,
    isMuted,
    playbackRate,
    
    // Queue and history
    queue,
    playbackHistory,
    
    // Timer state
    sleepTimerActive,
    sleepTimerRemaining,
    
    // UI state
    isMiniPlayerActive,
    
    // Settings
    playbackSettings,
    
    // Progress tracking
    tourProgress,
    trackProgress,
    
    // Audio controls
    playAudio,
    togglePlayPause,
    seekAudio,
    setVolume,
    toggleMute,
    skipForward,
    skipBackward,
    playNext,
    playPrevious,
    setPlaybackRate,
    
    // Queue management
    addToQueue,
    removeFromQueue,
    clearQueue,
    
    // Timer controls
    startSleepTimer,
    cancelSleepTimer,
    
    // UI controls
    showMiniPlayer,
    hideMiniPlayer,
    
    // Settings
    updatePlaybackSettings,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
