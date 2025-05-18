
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxTokenInput: React.FC<MapboxTokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');
  const [storedToken, setStoredToken] = useLocalStorage<string>('mapbox_token', '');
  const [isShowingForm, setIsShowingForm] = useState(false);
  
  useEffect(() => {
    if (storedToken) {
      onTokenSubmit(storedToken);
    } else {
      setIsShowingForm(true);
    }
  }, [storedToken, onTokenSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter your Mapbox access token",
        variant: "destructive"
      });
      return;
    }
    
    setStoredToken(token);
    onTokenSubmit(token);
    setIsShowingForm(false);
    toast({
      title: "Token Saved",
      description: "Your Mapbox token has been saved locally"
    });
  };
  
  const handleRemoveToken = () => {
    setStoredToken('');
    setIsShowingForm(true);
    toast({
      title: "Token Removed",
      description: "Your Mapbox token has been removed"
    });
  };
  
  if (!isShowingForm && storedToken) {
    return (
      <div className="absolute z-10 top-4 left-4 max-w-xs bg-white p-2 rounded-lg shadow-md">
        <p className="text-xs text-muted-foreground mb-1">Using Mapbox map</p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs"
            onClick={() => setIsShowingForm(true)}
          >
            Change API Key
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-7 text-xs">Remove</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Mapbox Token?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will switch back to the basic map. You'll need to enter your Mapbox token again to use Mapbox.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRemoveToken}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  return (
    <div className={isShowingForm ? "absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4" : "hidden"}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mapbox API Key Required</CardTitle>
          <CardDescription>
            Please enter your Mapbox public token to activate the map.
            You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              placeholder="Enter your Mapbox public token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => window.open("https://mapbox.com", "_blank")}>
              Get Token
            </Button>
            <div className="space-x-2">
              {storedToken && (
                <Button type="button" variant="outline" onClick={() => setIsShowingForm(false)}>
                  Cancel
                </Button>
              )}
              <Button type="submit">Save Token</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default MapboxTokenInput;
