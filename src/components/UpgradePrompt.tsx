
import React, { memo } from 'react';
import { Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UpgradePromptProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onUpgrade?: () => void;
  className?: string;
  variant?: 'default' | 'subtle' | 'banner';
}

// Using memo to prevent unnecessary re-renders
const UpgradePrompt = memo(({
  title = "Unlock Premium Tours",
  description = "Get unlimited access to all premium tours and exclusive content",
  buttonText = "Upgrade Now",
  onUpgrade = () => console.log("Upgrade clicked"),
  className = "",
  variant = 'default'
}: UpgradePromptProps) => {
  
  if (variant === 'subtle') {
    return (
      <div className={`text-center mt-4 ${className}`}>
        <Button 
          variant="ghost" 
          onClick={onUpgrade}
          className="text-gold hover:text-gold-dark"
        >
          <Crown className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    );
  }
  
  if (variant === 'banner') {
    return (
      <div className={`py-3 px-4 bg-gold/10 rounded-lg flex items-center justify-between ${className}`}>
        <div>
          <p className="font-medium text-sm text-desert-dark">{title}</p>
        </div>
        <Button 
          size="sm" 
          className="bg-gold hover:bg-gold-dark text-night"
          onClick={onUpgrade}
        >
          {buttonText}
        </Button>
      </div>
    );
  }
  
  return (
    <Card className={`border border-gold/20 overflow-hidden ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center mr-4">
            <Crown className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-desert-dark">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {description}
            </p>
            <Button 
              className="bg-gold hover:bg-gold-dark text-night w-full"
              onClick={onUpgrade}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

UpgradePrompt.displayName = 'UpgradePrompt';

export default UpgradePrompt;
