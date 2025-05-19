
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineAlertProps {
  isOffline: boolean;
}

const OfflineAlert = ({ isOffline }: OfflineAlertProps) => {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-destructive text-destructive-foreground p-2 text-center text-sm sticky top-0 z-50"
        >
          <AlertTriangle className="inline h-4 w-4 mr-1" />
          You're offline. Showing cached content.
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(OfflineAlert);
