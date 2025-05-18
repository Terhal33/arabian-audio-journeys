
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tour } from '@/services/toursData';
import EnhancedTourCard from '@/components/EnhancedTourCard';
import UpgradePrompt from '@/components/UpgradePrompt';

interface RecommendedToursProps {
  tours: Tour[];
  isPremium: boolean;
  isLoading: boolean;
}

const RecommendedTours = ({ tours, isPremium, isLoading }: RecommendedToursProps) => {
  const navigate = useNavigate();
  
  if (tours.length === 0) return null;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold text-desert-dark">Recommended For You</h2>
      </div>
      
      {isLoading ? (
        <div className="h-[300px] bg-white rounded-lg animate-pulse" />
      ) : (
        <EnhancedTourCard
          tour={tours[0]}
          featured={true}
        />
      )}
      
      {!isPremium && tours.length > 1 && (
        <UpgradePrompt
          variant="subtle"
          buttonText="See All Recommendations"
          onUpgrade={() => navigate('/subscription')}
        />
      )}
    </div>
  );
};

export default RecommendedTours;
