
import { useCallback, useEffect, useState } from 'react';
import { AdUnit } from './ads/types';
import { fetchAllAdUnits, fetchAdsByPosition, createAdUnit, updateAdUnit, deleteAdUnit, toggleAdActive } from './ads/adService';
import { defaultAdUnits } from './ads/defaultAds';

export { AdUnit };

/**
 * Hook to manage ad units in the application
 */
export const useAdManager = () => {
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAdsByPosition, setActiveAdsByPosition] = useState<Record<string, AdUnit[]>>({});

  // Load ad units from database
  const loadAdUnits = useCallback(async () => {
    setLoading(true);
    try {
      const ads = await fetchAllAdUnits();
      console.log('Loaded ad units:', ads);
      setAdUnits(ads);
      organizeAdsByPosition(ads);
    } catch (error) {
      console.error('Error loading ad units:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Organize ads by position for easier access
  const organizeAdsByPosition = useCallback((ads: AdUnit[]) => {
    const adsByPosition: Record<string, AdUnit[]> = {};
    
    ads.filter(ad => ad.active).forEach(ad => {
      if (!adsByPosition[ad.position]) {
        adsByPosition[ad.position] = [];
      }
      adsByPosition[ad.position].push(ad);
    });
    
    setActiveAdsByPosition(adsByPosition);
  }, []);

  // Get active ads for a specific position
  const getActiveAdsByPosition = useCallback((position: string): AdUnit[] => {
    return activeAdsByPosition[position] || [];
  }, [activeAdsByPosition]);

  // Add a new ad unit
  const addAdUnit = useCallback(async (ad: Omit<AdUnit, 'id'>) => {
    const newAd = await createAdUnit(ad);
    if (newAd) {
      setAdUnits(prev => [...prev, newAd]);
      if (newAd.active) {
        setActiveAdsByPosition(prev => {
          const updated = {...prev};
          if (!updated[newAd.position]) {
            updated[newAd.position] = [];
          }
          updated[newAd.position] = [...updated[newAd.position], newAd];
          return updated;
        });
      }
    }
    return newAd;
  }, []);

  // Update an existing ad unit
  const updateAdUnit = useCallback(async (id: string, updates: Partial<AdUnit>) => {
    const updatedAd = await updateAdUnit(id, updates);
    if (updatedAd) {
      setAdUnits(prev => prev.map(ad => ad.id === id ? updatedAd : ad));
      // Re-organize ads by position in case position or active status changed
      loadAdUnits();
    }
    return updatedAd;
  }, [loadAdUnits]);

  // Delete an ad unit
  const deleteAdUnit = useCallback(async (id: string) => {
    const success = await deleteAdUnit(id);
    if (success) {
      setAdUnits(prev => prev.filter(ad => ad.id !== id));
      setActiveAdsByPosition(prev => {
        const updated = {...prev};
        for (const position in updated) {
          updated[position] = updated[position].filter(ad => ad.id !== id);
          if (updated[position].length === 0) {
            delete updated[position];
          }
        }
        return updated;
      });
    }
    return success;
  }, []);

  // Toggle active status of an ad unit
  const toggleAdActive = useCallback(async (id: string) => {
    const updatedAd = await toggleAdActive(id);
    if (updatedAd) {
      setAdUnits(prev => prev.map(ad => ad.id === id ? updatedAd : ad));
      // Re-organize ads by position to update active ads
      loadAdUnits();
    }
    return updatedAd;
  }, [loadAdUnits]);

  // Reset to default ad units
  const resetToDefaults = useCallback(async () => {
    try {
      // Delete all existing ad units first
      const { error } = await supabase
        .from('ad_units')
        .delete()
        .neq('id', '0'); // Using neq with a non-existent ID to delete all
        
      if (error) throw error;

      // Then create the default ones
      for (const ad of defaultAdUnits) {
        await createAdUnit(ad);
      }
      
      // Reload from database
      loadAdUnits();
      
      return true;
    } catch (error) {
      console.error('Error resetting to defaults:', error);
      return false;
    }
  }, [loadAdUnits]);

  // Initial load
  useEffect(() => {
    loadAdUnits();
  }, [loadAdUnits]);
  
  // Return the hook interface
  return {
    adUnits,
    loading,
    getActiveAdsByPosition,
    addAdUnit,
    updateAdUnit,
    deleteAdUnit,
    toggleAdActive,
    resetToDefaults,
    reloadAds: loadAdUnits
  };
};

// Import supabase only for the resetToDefaults function
import { supabase } from '../integrations/supabase/client';
