
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
  
  // Load ads from Supabase on mount
  useEffect(() => {
    const loadAds = async () => {
      try {
        const { data, error } = await supabase
          .from('ad_units')
          .select('*');
        
        if (error) throw error;
        setAdUnits(data || []);
      } catch (e) {
        console.error('Failed to load ads:', e);
        setAdUnits([]);
      }
    };
    
    loadAds();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('ad_units_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ad_units' },
        (payload) => {
          loadAds(); // Reload ads when changes occur
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, []);
  
  // Add a new ad unit
  const addAdUnit = async (adUnit: Omit<AdUnit, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('ad_units')
        .insert([{ ...adUnit, id: `ad-${Date.now()}` }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Failed to add ad unit:', e);
      throw e;
    }
  };
  
  // Update an ad unit
  const updateAdUnit = async (id: string, updates: Partial<AdUnit>) => {
    try {
      const { error } = await supabase
        .from('ad_units')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    } catch (e) {
      console.error('Failed to update ad unit:', e);
      throw e;
    }
  };
  
  // Delete an ad unit
  const deleteAdUnit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ad_units')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (e) {
      console.error('Failed to delete ad unit:', e);
      throw e;
    }
  };
  
  // Toggle ad unit active state
  const toggleAdActive = async (id: string) => {
    const adUnit = adUnits.find(ad => ad.id === id);
    if (!adUnit) return;
    
    try {
      await updateAdUnit(id, { active: !adUnit.active });
    } catch (e) {
      console.error('Failed to toggle ad state:', e);
      throw e;
    }
  };
  
  // Reset to defaults (clear all ads)
  const resetToDefaults = async () => {
    try {
      const { error } = await supabase
        .from('ad_units')
        .delete()
        .neq('id', ''); // Delete all records
        
      if (error) throw error;
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
    addAdUnit,
    updateAdUnit,
    deleteAdUnit,
    toggleAdActive,
    resetToDefaults,
    getActiveAdsByPosition,
  };
};
