
/**
 * Enhanced ad blocker detection utility
 */

// List of common ad domains to check
const AD_DOMAINS = [
  'pagead2.googlesyndication.com',
  'securepubads.g.doubleclick.net',
  'ad.doubleclick.net',
  'adservice.google.com',
  'static.doubleclick.net'
];

// Check if a specific ad resource can be fetched
const canFetchAdResource = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    
    const response = await fetch(`https://${url}`, { 
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.log(`Ad fetch blocked: https://${url}`);
    return false;
  }
};

// Check if an ad div gets hidden by ad blockers
const isAdDivBlocked = (): boolean => {
  // Create a test div with common ad class names
  const testDiv = document.createElement('div');
  testDiv.className = 'ad-unit adsbox doubleclick ad-placement';
  testDiv.style.height = '10px';
  testDiv.style.position = 'absolute';
  testDiv.style.top = '-999px';
  document.body.appendChild(testDiv);
  
  // Check if ad blockers have hidden it or modified its properties
  const isBlocked = 
    testDiv.offsetHeight === 0 || 
    testDiv.clientHeight === 0 || 
    window.getComputedStyle(testDiv).display === 'none' ||
    window.getComputedStyle(testDiv).visibility === 'hidden';
  
  // Clean up
  document.body.removeChild(testDiv);
  return isBlocked;
};

export const checkForAdBlocker = async (): Promise<boolean> => {
  console.log("Running enhanced adblock detection...");
  
  let blockedCount = 0;
  let detectionMethods = 0;
  
  // Method 1: Try to fetch ad resources
  detectionMethods++;
  for (const domain of AD_DOMAINS.slice(0, 2)) { // Test just 2 domains for speed
    const canFetch = await canFetchAdResource(domain);
    if (!canFetch) {
      blockedCount++;
    }
  }
  
  // Method 2: Check if test ad div is blocked
  detectionMethods++;
  if (isAdDivBlocked()) {
    blockedCount++;
  }
  
  // Determine if an ad blocker is active based on multiple signals
  const isBlocked = blockedCount > 0;
  console.log(`Final adblock detection result: ${isBlocked ? "BLOCKED" : "NOT BLOCKED"} (${blockedCount} indicators)`);
  
  return isBlocked;
};
