
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdUnit {
  id: string;
  name: string;
  position: string;
  code: string;
  active: boolean;
  priority?: 'high' | 'normal' | 'low';
  viewThreshold?: number;
  frequency?: number;
}

export const useAdManager = () => {
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [impression, setImpression] = useState(0);
  
  // Used for frequency capping
  useEffect(() => {
    // Increment impression counter every page load
    setImpression(prev => prev + 1);
  }, []);
  
  // Load ads from Supabase on mount
  useEffect(() => {
    const loadAds = async () => {
      try {
        setLoading(true);
        console.log("Loading ad units from Supabase...");
        const { data, error } = await supabase
          .from('ad_units')
          .select('*');
        
        if (error) {
          console.error('Failed to load ads:', error);
          throw error;
        }
        
        console.log("Ad units loaded:", data?.length || 0);
        setAdUnits(data || []);
      } catch (e) {
        console.error('Failed to load ads:', e);
        setAdUnits([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadAds();
    
    // Subscribe to realtime changes
    console.log("Setting up realtime subscription for ad_units...");
    const channel = supabase
      .channel('ad_units_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ad_units' },
        (payload) => {
          console.log("Received real-time update for ad_units:", payload);
          loadAds(); // Reload ads when changes occur
        }
      )
      .subscribe();
    
    console.log("Realtime subscription activated");
      
    return () => {
      console.log("Cleaning up realtime subscription");
      channel.unsubscribe();
    };
  }, []);
  
  // Add a new ad unit
  const addAdUnit = async (adUnit: Omit<AdUnit, 'id'>) => {
    try {
      console.log("Adding new ad unit:", adUnit);
      
      // Check if the ad_units table exists
      const { error: tableCheckError } = await supabase
        .from('ad_units')
        .select('count(*)', { count: 'exact', head: true });
      
      if (tableCheckError) {
        console.log("Table may not exist, attempting to create it");
        
        // Create the table if it doesn't exist (only run once)
        const { error: createTableError } = await supabase.rpc('create_ad_units_table_if_not_exists');
        if (createTableError) {
          console.error("Failed to create table:", createTableError);
          // Continue anyway, as the table might exist but with a different error
        }
      }
      
      const newAdUnit = {
        ...adUnit,
        id: `ad-${Date.now()}`
      };
      
      const { data, error } = await supabase
        .from('ad_units')
        .insert([newAdUnit])
        .select();
      
      if (error) {
        console.error("Error inserting ad unit:", error);
        throw error;
      }
      
      console.log("Ad unit added successfully:", data);
      return data[0];
    } catch (e) {
      console.error('Failed to add ad unit:', e);
      throw e;
    }
  };
  
  // Update an ad unit
  const updateAdUnit = async (id: string, updates: Partial<AdUnit>) => {
    try {
      console.log("Updating ad unit:", id, updates);
      
      const { error } = await supabase
        .from('ad_units')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      console.log("Ad unit updated successfully");
    } catch (e) {
      console.error('Failed to update ad unit:', e);
      throw e;
    }
  };
  
  // Delete an ad unit
  const deleteAdUnit = async (id: string) => {
    try {
      console.log("Deleting ad unit:", id);
      
      const { error } = await supabase
        .from('ad_units')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log("Ad unit deleted successfully");
    } catch (e) {
      console.error('Failed to delete ad unit:', e);
      throw e;
    }
  };
  
  // Toggle ad unit active state
  const toggleAdActive = async (id: string) => {
    const adUnit = adUnits.find(ad => ad.id === id);
    if (!adUnit) {
      console.error("Ad unit not found:", id);
      return;
    }
    
    try {
      console.log("Toggling ad unit active state:", id, !adUnit.active);
      
      await updateAdUnit(id, { active: !adUnit.active });
      console.log("Ad unit active state toggled successfully");
    } catch (e) {
      console.error('Failed to toggle ad state:', e);
      throw e;
    }
  };
  
  // Reset to defaults (clear all ads)
  const resetToDefaults = async () => {
    try {
      console.log("Resetting all ad units to default");
      
      const { error } = await supabase
        .from('ad_units')
        .delete()
        .neq('id', ''); // Delete all records
        
      if (error) throw error;
      
      console.log("All ad units reset successfully");
    } catch (e) {
      console.error('Failed to reset ads:', e);
      throw e;
    }
  };
  
  // Get all active ad units for a position
  const getActiveAdsByPosition = (position: string) => {
    const activeAds = adUnits.filter(ad => {
      // Basic active check
      if (!ad.active) return false;
      
      // Position check
      if (ad.position !== position) return false;
      
      // Frequency capping check
      if (ad.frequency && impression % ad.frequency !== 0) return false;
      
      return true;
    });
    
    // Sort by priority if available
    return activeAds.sort((a, b) => {
      const priorityValues = { high: 3, normal: 2, low: 1, undefined: 0 };
      const priorityA = priorityValues[a.priority || 'undefined'];
      const priorityB = priorityValues[b.priority || 'undefined'];
      return priorityB - priorityA;
    });
  };
  
  return {
    adUnits,
    loading,
    impression,
    addAdUnit,
    updateAdUnit,
    deleteAdUnit,
    toggleAdActive,
    resetToDefaults,
    getActiveAdsByPosition,
  };
};
