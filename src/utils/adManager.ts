
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdUnit {
  id: string;
  name: string;
  position: string;
  code: string;
  active: boolean;
}

export const useAdManager = () => {
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      
      const newAdUnit = {
        ...adUnit,
        id: `ad-${Date.now()}`
      };
      
      const { data, error } = await supabase
        .from('ad_units')
        .insert([newAdUnit])
        .select()
        .single();
      
      if (error) throw error;
      
      console.log("Ad unit added successfully:", data);
      return data;
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
    return adUnits.filter(ad => ad.active && ad.position === position);
  };
  
  return {
    adUnits,
    loading,
    addAdUnit,
    updateAdUnit,
    deleteAdUnit,
    toggleAdActive,
    resetToDefaults,
    getActiveAdsByPosition,
  };
};
