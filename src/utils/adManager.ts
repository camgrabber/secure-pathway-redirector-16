// Ad configuration storage and management
import { useState, useEffect } from 'react';

export interface AdUnit {
  id: string;
  name: string;
  position: string;
  code: string;
  active: boolean;
}

// Initialize with empty ad units - users can add their own through admin panel
const defaultAdUnits: AdUnit[] = [];

// Local storage key
const AD_STORAGE_KEY = 'secure-pathway-ads';

// Hook to manage ad units
export const useAdManager = () => {
  const [adUnits, setAdUnits] = useState<AdUnit[]>([]);
  
  // Load ads from localStorage on mount
  useEffect(() => {
    const storedAds = localStorage.getItem(AD_STORAGE_KEY);
    if (storedAds) {
      try {
        setAdUnits(JSON.parse(storedAds));
      } catch (e) {
        console.error('Failed to parse stored ads', e);
        setAdUnits(defaultAdUnits);
        localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(defaultAdUnits));
      }
    } else {
      setAdUnits(defaultAdUnits);
      localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(defaultAdUnits));
    }
  }, []);
  
  // Save changes to localStorage
  const saveAdUnits = (updatedAdUnits: AdUnit[]) => {
    setAdUnits(updatedAdUnits);
    localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(updatedAdUnits));
  };
  
  // Add a new ad unit
  const addAdUnit = (adUnit: Omit<AdUnit, 'id'>) => {
    const newAdUnit = {
      ...adUnit,
      id: `ad-${Date.now()}`, // Generate unique ID
    };
    saveAdUnits([...adUnits, newAdUnit]);
    return newAdUnit;
  };
  
  // Update an ad unit
  const updateAdUnit = (id: string, updates: Partial<AdUnit>) => {
    const updatedAdUnits = adUnits.map(ad => 
      ad.id === id ? { ...ad, ...updates } : ad
    );
    saveAdUnits(updatedAdUnits);
  };
  
  // Delete an ad unit
  const deleteAdUnit = (id: string) => {
    const updatedAdUnits = adUnits.filter(ad => ad.id !== id);
    saveAdUnits(updatedAdUnits);
  };
  
  // Toggle ad unit active state
  const toggleAdActive = (id: string) => {
    const updatedAdUnits = adUnits.map(ad => 
      ad.id === id ? { ...ad, active: !ad.active } : ad
    );
    saveAdUnits(updatedAdUnits);
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    saveAdUnits(defaultAdUnits);
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
