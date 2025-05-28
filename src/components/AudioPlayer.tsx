
import { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Clock, ListMusic, Music2, X, ChevronUp, Settings,
  Download, Share2, Bookmark, BookmarkCheck, Rewind, FastForward
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import UpgradePrompt from '@/components/UpgradePrompt';

// Helper function to format time
const formatTime = (seconds: number) => {
  if (!seconds && seconds !== 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

interface AudioPlayerProps {
  mini?: boolean;
  className?: string;
  onExpand?: () => void;
}

const AudioPlayer = ({ mini = false, className = '', onExpand }: AudioPlayerProps) => {
  const { 
    isPlaying, 
    currentTrack, 
    duration, 
    currentTime, 
    progress,
    volume,
    isMuted,
    playbackRate,
    queue,
    sleepTimerActive,
    sleepTimerRemaining,
    isMiniPlayerActive,
    playbackSettings,
    togglePlayPause, 
    seekAudio,
    setVolume,
    toggleMute,
    skipForward,
    skipBackward,
    playNext,
    playPrevious,
    setPlaybackRate,
    startSleepTimer,
    cancelSleepTimer,
    updatePlaybackSettings,
  } = useAudio();
  
  const { isAuthenticated, user } = useAuth();
  const isPremium = user?.isPremium || false;
  
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [showSettings, setShowSettings] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Debug logging for audio player state
  useEffect(() => {
    console.log('AudioPlayer: State update:', {
      hasCurrentTrack: !!currentTrack,
      currentTrackTitle: currentTrack?.title,
      isPlaying,
      duration,
      currentTime,
      progress,
      isMiniPlayerActive
    });
  }, [currentTrack, isPlaying, duration, currentTime, progress, isMiniPlayerActive]);
  
  // Handle slider change for seeking
  const handleSeek = (value: number[]) => {
    console.log('AudioPlayer: Seeking to:', value[0], '%');
    if (duration > 0) {
      const newTime = (value[0] / 100) * duration;
      console.log('AudioPlayer: Calculated seek time:', newTime, 'seconds');
      seekAudio(newTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };
  
  // Handle sleep timer start
  const handleStartTimer = () => {
    startSleepTimer(timerMinutes);
    setShowSleepTimer(false);
  };
  
  // Toggle audio quality setting
  const toggleAudioQuality = () => {
    const newQuality = playbackSettings.preferredQuality === 'standard' ? 'high' : 'standard';
    
    // Check if high quality is restricted to premium users
    if (newQuality === 'high' && !isPremium) {
      // Show premium feature message
      return;
    }
    
    updatePlaybackSettings({
      preferredQuality: newQuality
    });
  };

  // Enhanced share functionality
  const handleShare = async () => {
    if (!currentTrack) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentTrack.title,
          text: `Listen to: ${currentTrack.title}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Could add toast notification here
      } catch (err) {
        console.error('Failed to copy to clipboard');
      }
    }
  };

  // Enhanced download functionality (premium feature)
  const handleDownload = async () => {
    if (!currentTrack || !isPremium) return;
    
    setIsDownloading(true);
    try {
      // In a real app, this would trigger a download
      console.log('Downloading track:', currentTrack.title);
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // If there's no current track playing, don't render anything
  if (!currentTrack && !isMiniPlayerActive) {
    console.log('AudioPlayer: No current track and mini player not active, not rendering');
    return null;
  }
  
  // Mini player version (shown when navigating away during playback)
  if (mini) {
    return (
      <div 
        className={`fixed bottom-16 left-0 right-0 bg-white shadow-md border-t z-30 px-4 py-2 ${className}`} 
        onClick={onExpand}
      >
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-desert/80 text-white hover:bg-desert-dark shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Mini player: Play/pause clicked');
              togglePlayPause();
            }}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentTrack?.title}</p>
            <div className="h-1 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-full bg-desert rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Full player version
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-40 ${className}`}>
      {/* Enhanced Track Info Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {currentTrack?.thumbnail && (
            <img 
              src={currentTrack.thumbnail} 
              alt={currentTrack.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {currentTrack?.title || 'No track selected'}
            </h3>
            {currentTrack?.tourId && (
              <p className="text-xs text-gray-500">Audio Tour</p>
            )}
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-600 hover:text-gold"
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-600 hover:text-oasis"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            {isPremium && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-600 hover:text-desert"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar - full width above controls */}
      <div 
        className="h-1 bg-gray-100 cursor-pointer" 
        onClick={(e) => {
          console.log('Progress bar clicked');
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const percentage = (clickX / rect.width) * 100;
          console.log('Click percentage:', percentage);
          handleSeek([percentage]);
        }}
      >
        <div 
          className="h-full bg-desert transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Sleep timer indicator */}
      {sleepTimerActive && (
        <div className="absolute top-1 right-0 bg-desert/10 text-desert-dark text-xs px-2 py-0.5 rounded-l-sm">
          <Clock className="h-3 w-3 inline-block mr-1" />
          {formatTime(sleepTimerRemaining || 0)} remaining
        </div>
      )}
      
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Left side - Enhanced playback controls */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          <div className="hidden sm:flex">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-600 hover:text-desert"
              onClick={() => {
                console.log('Previous track clicked');
                playPrevious();
              }}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Enhanced rewind button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-600 hover:text-desert hidden md:flex"
            onClick={() => skipBackward(30)}
          >
            <Rewind className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-desert text-white hover:bg-desert-dark"
            onClick={() => {
              console.log('Main play/pause clicked, current state:', isPlaying);
              togglePlayPause();
            }}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          {/* Enhanced fast forward button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-600 hover:text-desert hidden md:flex"
            onClick={() => skipForward(30)}
          >
            <FastForward className="h-4 w-4" />
          </Button>
          
          <div className="hidden sm:flex">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-600 hover:text-desert"
              onClick={() => {
                console.log('Next track clicked');
                playNext();
              }}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="sm:hidden flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1 text-xs"
              onClick={() => {
                console.log('Skip backward 10s clicked');
                skipBackward(10);
              }}
            >
              -10s
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1 text-xs"
              onClick={() => {
                console.log('Skip forward 10s clicked');
                skipForward(10);
              }}
            >
              +10s
            </Button>
          </div>
        </div>
          
        {/* Middle - Track info and seek control */}
        <div className="flex-1 max-w-xl mx-4 hidden sm:block">
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium line-clamp-1">{currentTrack?.title || 'No track selected'}</p>
              <p className="text-xs text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="h-1.5 cursor-pointer"
            />
          </div>
        </div>
        
        {/* Right - Additional controls */}
        <div className="flex items-center space-x-2">
          {/* Skip buttons (10s) - visible on larger screens */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => skipBackward(10)}
            >
              -10s
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => skipForward(10)}
            >
              +10s
            </Button>
          </div>
          
          {/* Volume control - visible on larger screens */}
          <div className="hidden md:flex items-center space-x-2 w-32">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="h-1.5 w-24"
            />
          </div>
          
          {/* Enhanced playback speed with more options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2"
              >
                {playbackRate}x
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                <DropdownMenuItem 
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={playbackRate === rate ? "bg-muted" : ""}
                >
                  {rate}x {rate === 1 ? '(Normal)' : rate < 1 ? '(Slower)' : '(Faster)'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Queue button */}
          <Sheet open={isQueueOpen} onOpenChange={setIsQueueOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <ListMusic className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Queue</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6">
                <Tabs defaultValue="queue">
                  <TabsList className="w-full">
                    <TabsTrigger value="queue" className="flex-1">Queue</TabsTrigger>
                    <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="queue" className="mt-4">
                    {queue.length === 0 ? (
                      <div className="text-center py-8">
                        <Music2 className="h-8 w-8 mx-auto opacity-30" />
                        <p className="text-sm text-muted-foreground mt-2">
                          No upcoming tracks
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {queue.map((track) => (
                          <div
                            key={track.id}
                            className="flex items-center p-2 hover:bg-muted rounded-md"
                          >
                            <div className="flex-1 min-w-0 mr-2">
                              <p className="font-medium truncate">{track.title}</p>
                              {track.tourId && (
                                <p className="text-xs text-muted-foreground">
                                  From: Tour Name
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-4">
                    <div className="text-center py-8">
                      <Music2 className="h-8 w-8 mx-auto opacity-30" />
                      <p className="text-sm text-muted-foreground mt-2">
                        No playback history yet
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Sleep timer button */}
          <Dialog open={showSleepTimer} onOpenChange={setShowSleepTimer}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Sleep Timer</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {sleepTimerActive ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold">{formatTime(sleepTimerRemaining || 0)}</p>
                      <p className="text-sm text-muted-foreground">
                        Playback will stop automatically
                      </p>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={cancelSleepTimer}
                    >
                      Cancel Timer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Select duration:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[5, 10, 15, 30, 45, 60].map((mins) => (
                          <Button 
                            key={mins} 
                            variant={timerMinutes === mins ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setTimerMinutes(mins)}
                          >
                            {mins} min
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleStartTimer}
                    >
                      Start Timer
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Enhanced settings button */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Audio Settings</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                {/* Audio quality selector */}
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="audio-quality" className="text-sm font-medium">
                      High quality audio
                    </Label>
                    {!isPremium && (
                      <p className="text-xs text-muted-foreground">
                        Premium feature
                      </p>
                    )}
                  </div>
                  <Switch
                    id="audio-quality"
                    disabled={!isPremium}
                    checked={playbackSettings.preferredQuality === 'high'}
                    onCheckedChange={toggleAudioQuality}
                  />
                </div>
                
                {/* Autoplay next */}
                <div className="flex justify-between items-center">
                  <Label htmlFor="autoplay" className="text-sm font-medium">
                    Autoplay next segment
                  </Label>
                  <Switch
                    id="autoplay"
                    checked={playbackSettings.autoplay}
                    onCheckedChange={(value) => updatePlaybackSettings({ autoplay: value })}
                  />
                </div>
                
                {/* Download for offline listening */}
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="offline-mode" className="text-sm font-medium">
                      Offline downloads
                    </Label>
                    {!isPremium && (
                      <p className="text-xs text-muted-foreground">
                        Premium feature
                      </p>
                    )}
                  </div>
                  <Switch
                    id="offline-mode"
                    disabled={!isPremium}
                    checked={false}
                  />
                </div>
                
                {!isPremium && (
                  <div className="mt-6">
                    <UpgradePrompt 
                      title="Unlock Premium Audio Features"
                      description="Enjoy high quality audio, offline downloads, and more"
                      variant="default"
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Expand button - on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:hidden"
            onClick={onExpand}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Mobile track info */}
      <div className="sm:hidden px-4 pb-3">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-medium truncate">{currentTrack?.title || 'No track selected'}</p>
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
  );
};

export default AudioPlayer;
