
import { useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

interface AudioPlayerProps {
  audioSrc?: string;
  title?: string;
  small?: boolean;
}

const AudioPlayer = ({ audioSrc, title, small }: AudioPlayerProps = {}) => {
  const { 
    isPlaying, 
    currentTrack, 
    duration, 
    currentTime, 
    progress,
    togglePlayPause, 
    seekAudio,
    audioTitle
  } = useAudio();

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seekAudio(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    // In a real implementation, you would set the volume of the audio element
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would mute/unmute the audio element
  };

  // Use props if provided, otherwise use context values
  const displayTitle = title || audioTitle || "Playing audio...";
  const displayTrack = audioSrc || currentTrack;
  
  if (!displayTrack && !currentTrack) {
    return null; // Don't render if there's no track
  }

  // Small version for embedded players
  if (small) {
    return (
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full bg-desert/80 text-white hover:bg-desert"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="ml-2 text-sm font-medium line-clamp-1">{displayTitle}</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 px-4 py-3 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-desert text-white hover:bg-desert-dark"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <div className="flex-1 max-w-xl">
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium line-clamp-1">{displayTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="h-1.5"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 w-32">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="h-1.5 w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
