
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Rewind,
  FastForward
} from 'lucide-react';

interface AudioTrack {
  id: string;
  title: string;
  description?: string;
  url: string;
  duration?: number;
  thumbnail?: string;
}

interface AudioPlayerProps {
  tracks: AudioTrack[];
  currentTrackIndex?: number;
  onTrackChange?: (index: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onProgress?: (progress: number) => void;
  autoPlay?: boolean;
  showPlaylist?: boolean;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  tracks,
  currentTrackIndex = 0,
  onTrackChange,
  onPlayStateChange,
  onProgress,
  autoPlay = false,
  showPlaylist = true,
  className = ""
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(currentTrackIndex);

  const currentAudioTrack = tracks[currentTrack];

  // Format time helper
  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Load audio track
  const loadTrack = useCallback(async (trackIndex: number) => {
    if (!audioRef.current || !tracks[trackIndex]) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const audio = audioRef.current;
      audio.src = tracks[trackIndex].url;
      
      // Wait for metadata to load
      await new Promise((resolve, reject) => {
        const handleLoadedMetadata = () => {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('error', handleError);
          resolve(void 0);
        };
        
        const handleError = () => {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('error', handleError);
          reject(new Error('Failed to load audio'));
        };
        
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('error', handleError);
      });
      
      setDuration(audio.duration);
      setCurrentTime(0);
    } catch (err) {
      setError('Failed to load audio track');
      console.error('Audio loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tracks]);

  // Play/Pause functionality
  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (err) {
      setError('Failed to play audio');
      console.error('Playback error:', err);
    }
  }, [isPlaying]);

  // Skip to next track
  const skipToNext = useCallback(() => {
    const nextIndex = (currentTrack + 1) % tracks.length;
    setCurrentTrack(nextIndex);
    onTrackChange?.(nextIndex);
  }, [currentTrack, tracks.length, onTrackChange]);

  // Skip to previous track
  const skipToPrevious = useCallback(() => {
    const prevIndex = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIndex);
    onTrackChange?.(prevIndex);
  }, [currentTrack, tracks.length, onTrackChange]);

  // Seek functionality
  const handleSeek = useCallback((value: number[]) => {
    if (!audioRef.current) return;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  // Volume control
  const handleVolumeChange = useCallback((value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  }, []);

  // Mute/Unmute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Skip forward/backward
  const skipTime = useCallback((seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [currentTime, duration]);

  // Playback speed
  const changePlaybackRate = useCallback(() => {
    if (!audioRef.current) return;
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    audioRef.current.playbackRate = nextRate;
  }, [playbackRate]);

  // Share functionality
  const handleShare = useCallback(async () => {
    if (!currentAudioTrack) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentAudioTrack.title,
          text: currentAudioTrack.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (err) {
        console.error('Failed to copy to clipboard');
      }
    }
  }, [currentAudioTrack]);

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };
    const handleEnded = () => {
      if (currentTrack < tracks.length - 1) {
        skipToNext();
      } else {
        setIsPlaying(false);
        onPlayStateChange?.(false);
      }
    };
    const handleError = () => {
      setError('Audio playback error');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack, tracks.length, skipToNext, onPlayStateChange]);

  // Load track when currentTrack changes
  useEffect(() => {
    loadTrack(currentTrack);
  }, [currentTrack, loadTrack]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isLoading && !error) {
      togglePlayPause();
    }
  }, [autoPlay, isLoading, error]); // Removed togglePlayPause from deps to avoid infinite loop

  // Update progress
  useEffect(() => {
    if (duration > 0) {
      const progress = (currentTime / duration) * 100;
      onProgress?.(progress);
    }
  }, [currentTime, duration, onProgress]);

  if (!currentAudioTrack) {
    return <div className="text-center py-4">No audio track available</div>;
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      <audio ref={audioRef} preload="metadata" />
      
      {/* Track Info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {currentAudioTrack.thumbnail && (
            <img 
              src={currentAudioTrack.thumbnail} 
              alt={currentAudioTrack.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {currentAudioTrack.title}
            </h3>
            {currentAudioTrack.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {currentAudioTrack.description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipToPrevious}
              disabled={isLoading}
              className="text-gray-600 hover:text-desert"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(-10)}
              disabled={isLoading}
              className="text-gray-600 hover:text-desert"
            >
              <Rewind className="h-4 w-4" />
            </Button>

            <Button
              onClick={togglePlayPause}
              disabled={isLoading || !!error}
              className="bg-gradient-to-r from-oasis to-oasis-dark hover:from-oasis-dark hover:to-desert text-white rounded-full p-3 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(10)}
              disabled={isLoading}
              className="text-gray-600 hover:text-desert"
            >
              <FastForward className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={skipToNext}
              disabled={isLoading}
              className="text-gray-600 hover:text-desert"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="text-gray-600 hover:text-gold"
            >
              {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-gray-600 hover:text-oasis"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={changePlaybackRate}
              className="text-gray-600 hover:text-oasis text-xs font-mono min-w-[3rem]"
            >
              {playbackRate}x
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-gray-600 hover:text-gold"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const link = document.createElement('a');
                link.href = currentAudioTrack.url;
                link.download = currentAudioTrack.title;
                link.click();
              }}
              className="text-gray-600 hover:text-desert"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setError(null);
                loadTrack(currentTrack);
              }}
              className="mt-2 text-red-600 hover:text-red-700"
            >
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1">
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
              disabled={isLoading || !duration}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && tracks.length > 1 && (
        <div className="border-t border-gray-100">
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Playlist</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrack(index);
                    onTrackChange?.(index);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    index === currentTrack
                      ? 'bg-oasis/10 border border-oasis/20'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === currentTrack ? 'bg-oasis text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index === currentTrack && isPlaying ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3 ml-0.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        index === currentTrack ? 'text-oasis' : 'text-gray-900'
                      }`}>
                        {track.title}
                      </p>
                      {track.description && (
                        <p className="text-sm text-gray-500 truncate">
                          {track.description}
                        </p>
                      )}
                    </div>
                    {track.duration && (
                      <span className="text-sm text-gray-500">
                        {formatTime(track.duration)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
