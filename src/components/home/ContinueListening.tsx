
import React from 'react';
import { Button } from '@/components/ui/button';
import { Headphones } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface ContinueListeningProps {
  isLoading?: boolean;
  lastTour?: {
    id: string;
    title: string;
    progress: number;
  } | null;
}

const ContinueListening = ({ isLoading = false, lastTour }: ContinueListeningProps) => {
  if (isLoading) {
    return (
      <section>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Skeleton className="h-7 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </section>
    );
  }
  
  if (!lastTour) {
    return (
      <section>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-display text-xl font-bold mb-4 text-desert-dark">Start Your Journey</h2>
          <p className="text-muted-foreground mb-4">Discover amazing audio tours across Saudi Arabia</p>
          <Button className="bg-desert hover:bg-desert-dark">
            Explore Tours
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-display text-xl font-bold mb-4 text-desert-dark">Continue Listening</h2>
        <p className="text-muted-foreground mb-4">Pick up where you left off on your audio journey</p>
        <div className="mb-4 bg-muted rounded-full h-2">
          <div 
            className="bg-desert h-2 rounded-full" 
            style={{ width: `${lastTour.progress}%` }}
          />
        </div>
        <Button className="bg-desert hover:bg-desert-dark flex items-center gap-2">
          <Headphones size={16} />
          <span>Resume {lastTour.title}</span>
        </Button>
      </div>
    </motion.section>
  );
};

export default React.memo(ContinueListening);
