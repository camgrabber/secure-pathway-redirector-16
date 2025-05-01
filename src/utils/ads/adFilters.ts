
import { AdUnit } from './types';

// Get all active ad units for a position
export const getActiveAdsByPosition = (
  adUnits: AdUnit[], 
  position: string, 
  impression: number
): AdUnit[] => {
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
  return sortAdsByPriority(activeAds);
};

// Sort ads by priority
export const sortAdsByPriority = (ads: AdUnit[]): AdUnit[] => {
  return ads.sort((a, b) => {
    const priorityValues = { high: 3, normal: 2, low: 1, undefined: 0 };
    const priorityA = priorityValues[a.priority || 'undefined'];
    const priorityB = priorityValues[b.priority || 'undefined'];
    return priorityB - priorityA;
  });
};
