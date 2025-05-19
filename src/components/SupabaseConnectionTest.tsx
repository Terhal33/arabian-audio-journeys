
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const testConnection = async () => {
    try {
      console.log("Testing Supabase connection...");
      setConnectionStatus('checking');
      setErrorDetails(null);
      
      // Simple query to test the connection
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count(*)', { count: 'exact' })
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      console.log("Supabase connection successful:", data);
      setConnectionStatus('success');
      setErrorDetails(null);
      
      toast({
        title: "Supabase Connected",
        description: "Successfully connected to Supabase",
      });
    } catch (error) {
      console.error("Supabase connection failed:", error);
      setConnectionStatus('failed');
      
      // Extract more detailed error information
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      setErrorDetails(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Could not connect to Supabase. Check console for details.",
      });
    }
  };
  
  useEffect(() => {
    testConnection();
  }, []);
  
  return (
    <div className="fixed bottom-20 right-4 z-50 p-3 rounded-md shadow-md bg-background border">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          connectionStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 
          connectionStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className="text-xs font-medium">
          {connectionStatus === 'checking' ? 'Checking Supabase...' : 
           connectionStatus === 'success' ? 'Supabase Connected' : 'Connection Failed'}
        </span>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 ml-1" 
          onClick={testConnection}
          title="Retry connection"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      
      {connectionStatus === 'failed' && errorDetails && (
        <div className="mt-2 text-xs text-red-500 max-w-xs overflow-hidden text-ellipsis">
          <div className="flex items-start gap-1">
            <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <span className="break-words">{errorDetails}</span>
          </div>
        </div>
      )}
      
      {connectionStatus === 'success' && (
        <div className="mt-2 text-xs text-green-500 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Database is operational</span>
        </div>
      )}
    </div>
  );
};

export default SupabaseConnectionTest;
