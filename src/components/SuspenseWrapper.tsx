
import React, { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SuspenseWrapper = ({ children, fallback }: SuspenseWrapperProps) => {
  const defaultFallback = (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <LoadingSpinner size="large" text="Loading..." />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;
