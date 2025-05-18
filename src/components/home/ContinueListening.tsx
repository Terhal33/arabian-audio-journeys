
import React from 'react';
import { Button } from '@/components/ui/button';

const ContinueListening = () => {
  return (
    <section>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-display text-xl font-bold mb-4 text-desert-dark">Continue Listening</h2>
        <p className="text-muted-foreground mb-4">Pick up where you left off on your audio journey</p>
        <Button className="bg-desert hover:bg-desert-dark">
          Resume Last Tour
        </Button>
      </div>
    </section>
  );
};

export default ContinueListening;
