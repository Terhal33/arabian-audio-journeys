
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing Supabase connection...");
        
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
        
        toast({
          title: "Supabase Connected",
          description: "Successfully connected to Supabase",
        });
      } catch (error) {
        console.error("Supabase connection failed:", error);
        setConnectionStatus('failed');
        
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Could not connect to Supabase. Check console for details.",
        });
      }
    };
    
    testConnection();
  }, []);
  
  return (
    <div className="fixed bottom-20 right-4 z-50 p-2 rounded-md shadow-md bg-background border">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          connectionStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 
          connectionStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className="text-xs font-medium">
          {connectionStatus === 'checking' ? 'Checking Supabase...' : 
           connectionStatus === 'success' ? 'Supabase Connected' : 'Connection Failed'}
        </span>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;
