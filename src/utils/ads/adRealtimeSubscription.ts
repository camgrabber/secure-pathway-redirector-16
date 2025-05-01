
import { supabase } from '@/integrations/supabase/client';

export const subscribeToAdChanges = (onAdChange: () => void): (() => void) => {
  console.log("Setting up realtime subscription for ad_units...");
  
  const channel = supabase
    .channel('ad_units_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'ad_units' },
      (payload) => {
        console.log("Received real-time update for ad_units:", payload);
        onAdChange(); // Notify that ads have changed
      }
    )
    .subscribe();
  
  console.log("Realtime subscription activated");
    
  // Return unsubscribe function
  return () => {
    console.log("Cleaning up realtime subscription");
    channel.unsubscribe();
  };
};
