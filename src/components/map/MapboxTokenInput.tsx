
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxTokenInput: React.FC<MapboxTokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');
  const [storedToken, setStoredToken] = useLocalStorage<string>('mapbox_token', '');
  
  useEffect(() => {
    if (storedToken) {
      onTokenSubmit(storedToken);
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
    toast({
      title: "Token Saved",
      description: "Your Mapbox token has been saved locally"
    });
  };
  
  if (storedToken) {
    return (
      <div className="absolute z-10 top-4 left-4 max-w-xs bg-white p-2 rounded-lg shadow-md text-xs text-muted-foreground">
        <p>Using Mapbox map</p>
        <Button 
          variant="link" 
          className="h-auto p-0 text-xs"
          onClick={() => setStoredToken('')}
        >
          Change API key
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
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
            <Button type="submit">Save Token</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default MapboxTokenInput;
