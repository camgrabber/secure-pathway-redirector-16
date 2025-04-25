
// Ad configuration storage and management
import { useState, useEffect } from 'react';

export interface AdUnit {
  id: string;
  name: string;
  position: string;
  code: string;
  active: boolean;
}

// Default ad units based on HTML provided
const defaultAdUnits: AdUnit[] = [
  {
    id: "ad-top",
    name: "Top Ad",
    position: "top",
    code: `<div id="shareus-admanager-7553637303-ZUZtNtTORG">
<script>
(function(fwmeo){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = fwmeo || {};
s.src = "\/\/unfortunate-dark.com\/bMXfV.sNd\/G\/lI0-YqWzdNiWYiWP5CuWZHXZIq\/ReEmx9zumZ\/UMlVkpPoTLY_xYNEj\/YEzZMXj\/gxtRNQjNE\/2\/NhjOM\/yKOHQO";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
</script>
</div>`,
    active: true
  },
  {
    id: "ad-middle",
    name: "Middle Ad",
    position: "middle",
    code: `<div id="shareus-admanager-7553637303-sIjAuMsDg5">
<script>
(function(pptdci){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = pptdci || {};
s.src = "\/\/unfortunate-dark.com\/b\/X.V\/sbdwG\/lZ0aYrWudniPYjW\/5uugZIXDIi\/Ye\/mg9fuDZSU\/lgk\/PoTaYZxbNTj\/YnzoNcD\/gptUNrj-EE2\/NSjUMA0IOtQe";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
</script>
</div>`,
    active: true
  },
  {
    id: "ad-after-timer",
    name: "After Timer Ad",
    position: "after-timer",
    code: `<div id="shareus-admanager-7553637303-DHz4l59z3F">
<script>
(function(kexrql){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = kexrql || {};
s.src = "\/\/unfortunate-dark.com\/b.X-V\/sgdzGwlx0cYyWddxiWYWWE5ruDZkXtIx\/he\/mX9\/uNZ\/UdlukRPYTdYCxxNMjXY\/0xNzjuEmt\/NSjzEi2DNdjGQw2yMugv";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
</script>
</div>`,
    active: true
  },
  {
    id: "ad-bottom",
    name: "Bottom Ad",
    position: "bottom",
    code: `<div id="shareus-admanager-7553637303-zRMllh9F4D">
<script>
(function(mrkl){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = mrkl || {};
s.src = "\/\/unfortunate-dark.com\/bKXHV.syd\/GAly0vYNWPdmiSY\/WV5GuWZ-XNIL\/qeOmv9_uUZ\/UnlJkpPuTnYcxnNgjFYH0yO-D\/kJtsNtjIEQ2\/NojxQb5qM\/Aw";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
</script>
</div>`,
    active: true
  }
];

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
