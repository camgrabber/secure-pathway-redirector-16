
import { useState, useEffect } from 'react';
import { AdUnit } from './ads/types';
import { 
  loadAds, 
  addAdUnit as addAdUnitService, 
  updateAdUnit as updateAdUnitService,
  deleteAdUnit as deleteAdUnitService,
  resetToDefaults as resetToDefaultsService
} from './ads/adService';
import { subscribeToAdChanges } from './ads/adRealtimeSubscription';
import { getActiveAdsByPosition } from './ads/adFilters';

export type { AdUnit } from './ads/types';

export const useAdManager = () => {
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [impression, setImpression] = useState(0);
  
  // Used for frequency capping
  useEffect(() => {
    // Increment impression counter every page load
    setImpression(prev => prev + 1);
  }, []);
  
  // Load ads from Supabase on mount and set up subscription
  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const ads = await loadAds();
        setAdUnits(ads);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAds();
    
    // Set up subscription to realtime changes
    const unsubscribe = subscribeToAdChanges(() => {
      fetchAds(); // Reload ads when changes occur
    });
    
    return unsubscribe;
  }, []);
  
  // Add a new ad unit
  const addAdUnit = async (adUnit: Omit<AdUnit, 'id'>) => {
    const newAd = await addAdUnitService(adUnit);
    return newAd;
  };
  
  // Update an ad unit
  const updateAdUnit = async (id: string, updates: Partial<AdUnit>) => {
    await updateAdUnitService(id, updates);
  };
  
  // Delete an ad unit
  const deleteAdUnit = async (id: string) => {
    await deleteAdUnitService(id);
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
    await resetToDefaultsService();
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
    getActiveAdsByPosition: (position: string) => 
      getActiveAdsByPosition(adUnits, position, impression),
  };
};
