
import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

interface AudioTrack {
  id: string;
  url: string;
  title: string;
  tourId?: string;
  duration?: number;
  isPremium?: boolean;
}

interface SavedProgress {
  [trackId: string]: {
    position: number;
    completed: boolean;
    lastPlayed: number; // timestamp
  }
}

interface TourProgress {
  [tourId: string]: {
    lastSegmentId: string;
    completedSegments: string[];
    totalDuration: number;
    listenedDuration: number;
  }
}

interface PlaybackSettings {
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  autoplay: boolean;
  sleepTimerMinutes: number | null;
  preferredQuality: 'standard' | 'high';
}

interface AudioContextType {
  // Playback state
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  
  // Playback history and queue
  queue: AudioTrack[];
  playbackHistory: AudioTrack[];
  
  // Progress info
  trackProgress: SavedProgress;
  tourProgress: TourProgress;
  
  // Mini player state
  isMiniPlayerActive: boolean;
  
  // Timer state
  sleepTimerActive: boolean;
  sleepTimerRemaining: number | null;
  
  // Controls
  playAudio: (track: AudioTrack, autoplay?: boolean) => void;
  playAudioWithUrl: (url: string, title?: string, tourId?: string, isPremium?: boolean) => void;
  pauseAudio: () => void;
  stopAudio: () => void;
  seekAudio: (time: number) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  
  // Queue management
  addToQueue: (track: AudioTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  
  // Sleep timer
  startSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
  
  // Mini player
  showMiniPlayer: () => void;
  hideMiniPlayer: () => void;
  
  // Settings
  playbackSettings: PlaybackSettings;
  updatePlaybackSettings: (settings: Partial<PlaybackSettings>) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const DEFAULT_PLAYBACK_SETTINGS: PlaybackSettings = {
  playbackRate: 1,
  volume: 1,
  isMuted: false,
  autoplay: true,
  sleepTimerMinutes: null,
  preferredQuality: 'standard'
};

export function AudioProvider({ children }: { children: ReactNode }) {
  // Core audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Queue and history
  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [playbackHistory, setPlaybackHistory] = useState<AudioTrack[]>([]);
  
  // UI state
  const [isMiniPlayerActive, setIsMiniPlayerActive] = useState(false);
  
  // Timer state
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  
  // Settings with localStorage persistence
  const [playbackSettings, setPlaybackSettings] = useLocalStorage<PlaybackSettings>(
    'aaj_playback_settings', 
    DEFAULT_PLAYBACK_SETTINGS
  );
  
  // Progress tracking with localStorage persistence
  const [trackProgress, setTrackProgress] = useLocalStorage<SavedProgress>('aaj_track_progress', {});
  const [tourProgress, setTourProgress] = useLocalStorage<TourProgress>('aaj_tour_progress', {});
  
  // Audio element and timers refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressSaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Extract current settings for easier access
  const { volume, isMuted, playbackRate } = playbackSettings;
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up audio event listeners
      const audio = audioRef.current;
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
    }
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.pause();
        audio.src = '';
        
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        
        clearSleepTimer();
        clearProgressSaveInterval();
      }
    };
  }, []);
  
  // Apply volume and playback rate when settings change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);
  
  // Audio event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      
      // Restore saved progress if available
      if (currentTrack) {
        const saved = trackProgress[currentTrack.id];
        if (saved && saved.position > 0 && saved.position < audioRef.current.duration - 10) {
          audioRef.current.currentTime = saved.position;
          setCurrentTime(saved.position);
          setProgress((saved.position / audioRef.current.duration) * 100);
          
          // Notify user about resumed playback
          toast({
            title: "Resuming playback",
            description: `Continuing from ${formatTime(saved.position)}`,
            duration: 3000,
          });
        }
      }
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      
      // If this is premium content and user is not premium, check for preview limit
      if (currentTrack?.isPremium && !isPremiumUser()) {
        const previewLimit = 120; // 2 minute preview
        if (audioRef.current.currentTime >= previewLimit) {
          audioRef.current.pause();
          setIsPlaying(false);
          
          // Show upgrade prompt
          toast({
            title: "Preview ended",
            description: "Upgrade to premium to listen to the full audio tour",
            duration: 5000,
            action: {
              onClick: () => {
                // Navigate to upgrade page or show upgrade modal
                console.log("Navigate to upgrade page");
              }
            }
          });
        }
      }
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    
    // Mark track as completed
    if (currentTrack) {
      updateTrackProgress(currentTrack.id, audioRef.current?.duration || 0, true);
      
      // Update tour progress if applicable
      if (currentTrack.tourId) {
        updateTourProgress(currentTrack.tourId, currentTrack.id, audioRef.current?.duration || 0);
      }
      
      // Auto-play next track if enabled and queue has tracks
      if (playbackSettings.autoplay && queue.length > 0) {
        const nextTrack = queue[0];
        const newQueue = queue.slice(1);
        
        // Add current track to history
        if (currentTrack) {
          setPlaybackHistory(prev => [currentTrack, ...prev.slice(0, 19)]);
        }
        
        // Play next track
        setQueue(newQueue);
        playAudio(nextTrack, true);
      }
    }
  };
  
  const handleError = (e: ErrorEvent) => {
    console.error("Audio playback error:", e);
    setIsPlaying(false);
    
    toast({
      title: "Playback error",
      description: "There was an error playing this audio. Please try again.",
      variant: "destructive",
    });
  };
  
  // Timer and interval management
  const startProgressSaveInterval = () => {
    clearProgressSaveInterval();
    
    // Save progress every 5 seconds during playback
    progressSaveIntervalRef.current = setInterval(() => {
      if (isPlaying && currentTrack && audioRef.current) {
        updateTrackProgress(currentTrack.id, audioRef.current.currentTime, false);
        
        // Update tour progress if applicable
        if (currentTrack.tourId) {
          updateTourProgress(currentTrack.tourId, currentTrack.id, audioRef.current.currentTime);
        }
      }
    }, 5000);
  };
  
  const clearProgressSaveInterval = () => {
    if (progressSaveIntervalRef.current) {
      clearInterval(progressSaveIntervalRef.current);
      progressSaveIntervalRef.current = null;
    }
  };
  
  // Progress tracking functions
  const updateTrackProgress = (trackId: string, position: number, completed: boolean) => {
    setTrackProgress((prev: SavedProgress) => {
      const newProgress = { ...prev };
      newProgress[trackId] = {
        position,
        completed,
        lastPlayed: Date.now()
      };
      return newProgress;
    });
  };
  
  const updateTourProgress = (tourId: string, segmentId: string, currentPosition: number) => {
    setTourProgress((prev: TourProgress) => {
      const newProgress = { ...prev };
      const tourData = prev[tourId] || {
        lastSegmentId: segmentId,
        completedSegments: [],
        totalDuration: 0,
        listenedDuration: 0
      };
      
      // Calculate duration listened
      let listenedDuration = tourData.listenedDuration;
      if (currentTrack?.duration) {
        // If we have track duration, use it to calculate listened duration more accurately
        listenedDuration = Math.min(currentPosition, currentTrack.duration);
      } else {
        // Otherwise just use the current position
        listenedDuration = currentPosition;
      }
      
      // Update completed segments
      let completedSegments = [...tourData.completedSegments];
      if (!completedSegments.includes(segmentId) && currentPosition >= (currentTrack?.duration || 0) * 0.9) {
        completedSegments.push(segmentId);
      }
      
      newProgress[tourId] = {
        lastSegmentId: segmentId,
        completedSegments,
        totalDuration: tourData.totalDuration, // This would be updated elsewhere with tour metadata
        listenedDuration
      };
      
      return newProgress;
    });
  };
  
  // Sleep timer functions
  const startSleepTimer = (minutes: number) => {
    clearSleepTimer();
    
    setSleepTimerActive(true);
    setSleepTimerRemaining(minutes * 60); // convert to seconds
    
    const endTime = Date.now() + minutes * 60 * 1000;
    
    // Update remaining time display
    const updateTimerDisplay = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setSleepTimerRemaining(remaining);
      
      if (remaining <= 0) {
        pauseAudio();
        setSleepTimerActive(false);
        setSleepTimerRemaining(null);
        return;
      }
      
      sleepTimerRef.current = setTimeout(updateTimerDisplay, 1000);
    };
    
    sleepTimerRef.current = setTimeout(updateTimerDisplay, 1000);
    
    // Update settings
    setPlaybackSettings((prev: PlaybackSettings) => ({
      ...prev,
      sleepTimerMinutes: minutes
    }));
    
    toast({
      title: "Sleep timer started",
      description: `Playback will stop in ${minutes} minute${minutes !== 1 ? 's' : ''}`,
    });
  };
  
  const cancelSleepTimer = () => {
    clearSleepTimer();
    setSleepTimerActive(false);
    setSleepTimerRemaining(null);
    
    // Update settings
    setPlaybackSettings((prev: PlaybackSettings) => ({
      ...prev,
      sleepTimerMinutes: null
    }));
    
    toast({
      title: "Sleep timer cancelled",
    });
  };
  
  const clearSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
  };
  
  // Playback control functions
  const playAudio = (track: AudioTrack, autoplay = true) => {
    if (!audioRef.current) return;
    
    const isSameTrack = currentTrack?.id === track.id && currentTrack?.url === track.url;
    
    // If trying to play a premium track and user is not premium, check for preview
    if (track.isPremium && !isPremiumUser()) {
      toast({
        title: "Preview mode",
        description: "You're listening to a 2-minute preview. Upgrade for full access.",
        duration: 4000,
      });
    }
    
    // Set up new audio source if different track
    if (!isSameTrack) {
      // If already playing something else, add current track to history
      if (currentTrack && isPlaying) {
        setPlaybackHistory(prev => [currentTrack, ...prev.slice(0, 19)]);
      }
      
      // Update audio source
      audioRef.current.src = track.url;
      audioRef.current.load();
      
      // Update state
      setCurrentTrack(track);
      setDuration(0);
      setCurrentTime(0);
      setProgress(0);
    }
    
    // Play audio and update state
    if (autoplay) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          startProgressSaveInterval();
          // Activate mini player if navigating away during playback
          setIsMiniPlayerActive(true);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          
          toast({
            title: "Playback error",
            description: "Unable to play audio. Please try again.",
            variant: "destructive",
          });
        });
    }
  };
  
  const playAudioWithUrl = (url: string, title = "Audio track", tourId?: string, isPremium = false) => {
    const track: AudioTrack = {
      id: `track-${Date.now()}`,
      url,
      title,
      tourId,
      isPremium
    };
    
    playAudio(track);
  };
  
  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      clearProgressSaveInterval();
      
      // Save progress on pause
      if (currentTrack && audioRef.current) {
        updateTrackProgress(currentTrack.id, audioRef.current.currentTime, false);
      }
    }
  };
  
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      clearProgressSaveInterval();
      
      // Reset current track but keep it in history
      if (currentTrack) {
        setPlaybackHistory(prev => [currentTrack, ...prev.filter(t => t.id !== currentTrack.id).slice(0, 19)]);
        setCurrentTrack(null);
      }
    }
  };
  
  const seekAudio = (time: number) => {
    if (audioRef.current) {
      const newTime = (time / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(time);
      
      // If seeking in a premium track as non-premium user, check if beyond preview limit
      if (currentTrack?.isPremium && !isPremiumUser() && newTime > 120) {
        // Limit to 2 minutes
        audioRef.current.currentTime = 120;
        setCurrentTime(120);
        setProgress((120 / duration) * 100);
        
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        
        toast({
          title: "Preview limit reached",
          description: "Upgrade to premium to listen to the full audio tour",
          duration: 5000,
          action: {
            onClick: () => {
              // Navigate to upgrade page or show upgrade modal
              console.log("Navigate to upgrade page");
            }
          }
        });
      }
    }
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else if (currentTrack) {
      playAudio(currentTrack);
    }
  };
  
  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    
    setPlaybackSettings((prev: PlaybackSettings) => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0
    }));
  };
  
  const toggleMute = () => {
    const newMuteState = !isMuted;
    
    if (audioRef.current) {
      audioRef.current.volume = newMuteState ? 0 : volume;
    }
    
    setPlaybackSettings((prev: PlaybackSettings) => ({
      ...prev,
      isMuted: newMuteState
    }));
  };
  
  const setPlaybackRate = (rate: number) => {
    const validRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const newRate = validRates.includes(rate) ? rate : 1;
    
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
    
    setPlaybackSettings((prev: PlaybackSettings) => ({
      ...prev,
      playbackRate: newRate
    }));
    
    toast({
      title: `Playback speed: ${newRate}x`,
      duration: 1500,
    });
  };
  
  const skipForward = (seconds = 10) => {
    if (audioRef.current && currentTrack) {
      const newTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds);
      
      // Check premium limits
      if (currentTrack.isPremium && !isPremiumUser() && newTime > 120) {
        // Show upgrade message
        toast({
          title: "Preview limit reached",
          description: "Upgrade to premium to listen to the full audio tour",
        });
        return;
      }
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress((newTime / audioRef.current.duration) * 100);
    }
  };
  
  const skipBackward = (seconds = 10) => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - seconds);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress((newTime / audioRef.current.duration) * 100);
    }
  };
  
  const playNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const newQueue = queue.slice(1);
      
      // Add current track to history
      if (currentTrack) {
        setPlaybackHistory(prev => [currentTrack, ...prev.slice(0, 19)]);
      }
      
      // Play next track
      setQueue(newQueue);
      playAudio(nextTrack, true);
    } else {
      toast({
        title: "No more tracks",
        description: "The queue is empty",
      });
    }
  };
  
  const playPrevious = () => {
    if (playbackHistory.length > 0) {
      const prevTrack = playbackHistory[0];
      const newHistory = playbackHistory.slice(1);
      
      // Add current track to queue if playing
      if (currentTrack) {
        setQueue(prev => [currentTrack, ...prev]);
      }
      
      // Play previous track
      setPlaybackHistory(newHistory);
      playAudio(prevTrack, true);
    } else {
      // Restart current track if no history
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setProgress(0);
      }
    }
  };
  
  // Queue management
  const addToQueue = (track: AudioTrack) => {
    setQueue(prev => [...prev, track]);
    
    toast({
      title: "Added to queue",
      description: track.title,
      duration: 2000,
    });
  };
  
  const removeFromQueue = (trackId: string) => {
    setQueue(prev => prev.filter(track => track.id !== trackId));
  };
  
  const clearQueue = () => {
    setQueue([]);
  };
  
  // Mini player controls
  const showMiniPlayer = () => {
    setIsMiniPlayerActive(true);
  };
  
  const hideMiniPlayer = () => {
    setIsMiniPlayerActive(false);
  };
  
  // Settings management
  const updatePlaybackSettings = (settings: Partial<PlaybackSettings>) => {
    setPlaybackSettings((prev: PlaybackSettings) => ({
      ...prev,
      ...settings
    }));
  };
  
  // Helper functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const isPremiumUser = () => {
    // This would typically check user subscription status from your auth context
    // For now we'll return false as a placeholder
    return false;
  };
  
  // Context value
  const value: AudioContextType = {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    playbackRate,
    queue,
    playbackHistory,
    isMiniPlayerActive,
    sleepTimerActive,
    sleepTimerRemaining,
    trackProgress,
    tourProgress,
    playbackSettings,
    
    // Playback controls
    playAudio,
    playAudioWithUrl,
    pauseAudio,
    stopAudio,
    seekAudio,
    togglePlayPause,
    setVolume,
    toggleMute,
    setPlaybackRate,
    skipForward,
    skipBackward,
    playNext,
    playPrevious,
    
    // Queue management
    addToQueue,
    removeFromQueue,
    clearQueue,
    
    // Sleep timer
    startSleepTimer,
    cancelSleepTimer,
    
    // Mini player
    showMiniPlayer,
    hideMiniPlayer,
    
    // Settings
    updatePlaybackSettings
  };
  
  return (
    <AudioContext.Provider value={value}>
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
