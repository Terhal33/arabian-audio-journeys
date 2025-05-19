
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tour } from '@/services/toursData';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { triggerHapticFeedback } from '@/utils/animation';

interface ShareTourProps {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
}

const ShareTour = ({ tour, isOpen, onClose }: ShareTourProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = `${window.location.origin}/tours/${tour.id}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      triggerHapticFeedback('light');
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually",
        variant: "destructive",
      });
    }
  };
  
  const handleShare = async () => {
    triggerHapticFeedback('medium');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: tour.title,
          text: `Check out this audio tour: ${tour.title}`,
          url: shareUrl,
        });
        toast({
          title: "Shared successfully",
          description: "Tour has been shared",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Sharing failed",
            description: "Please try the copy link option instead",
            variant: "destructive",
          });
        }
      }
    } else {
      handleCopyLink();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this tour</DialogTitle>
          <DialogDescription>
            Share "{tour.title}" with friends and family.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="select-all"
            />
          </div>
          <Button onClick={handleCopyLink} type="button" size="sm" className="px-3">
            {isCopied ? "Copied" : "Copy"}
          </Button>
        </div>
        
        <div className="flex flex-col space-y-2 mt-4">
          <p className="text-sm text-muted-foreground mb-2">Or share via:</p>
          
          <div className="flex justify-around">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
              className="flex flex-col items-center justify-center p-2 rounded-full bg-blue-500 text-white h-12 w-12"
            >
              <span className="text-xs mt-1">FB</span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this audio tour: ${tour.title}`)}`, '_blank')}
              className="flex flex-col items-center justify-center p-2 rounded-full bg-blue-400 text-white h-12 w-12"
            >
              <span className="text-xs mt-1">X</span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this audio tour: ${tour.title} ${shareUrl}`)}`, '_blank')}
              className="flex flex-col items-center justify-center p-2 rounded-full bg-green-500 text-white h-12 w-12"
            >
              <span className="text-xs mt-1">WA</span>
            </motion.button>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start mt-4">
          <Button
            type="button"
            variant="default"
            onClick={handleShare}
            className="w-full sm:w-auto"
          >
            Share now
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTour;
