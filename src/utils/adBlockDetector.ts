
// Enhanced ad blocker detection with multiple reliable detection methods
export const checkForAdBlocker = async (): Promise<boolean> => {
  try {
    // Method 1: Create and check a bait element
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox ad-slot ad-banner googlead adsense advert';
    document.body.appendChild(testAd);
    
    // Method 2: Try to fetch a known ad script URL
    const fetchPromise = fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
      signal: AbortSignal.timeout(2000)
    }).catch(() => {
      console.log('Ad fetch blocked - adblock detected');
      return null;
    });
    
    // Method 3: Check for common ad blocker extensions
    const hasAdBlockStyle = !!document.getElementById('AdBlocker-detector') ||
                          !!document.getElementById('AdBlock-detector') ||
                          !!document.getElementById('AdBlocker-notification');
    
    // Wait a moment for adblockers to process the elements
    await new Promise(resolve => setTimeout(resolve, 100));
    await Promise.race([fetchPromise, new Promise(r => setTimeout(r, 2000))]);
    
    // Check if our test ad was hidden, removed, or modified
    const isAdHidden = !testAd.offsetHeight || 
                      window.getComputedStyle(testAd).display === 'none' || 
                      window.getComputedStyle(testAd).visibility === 'hidden';
    
    // Clean up
    if (document.body.contains(testAd)) {
      document.body.removeChild(testAd);
    }
    
    // Log results for debugging
    console.log(`AdBlock detection results - Hidden ad: ${isAdHidden}, AdBlock styles: ${hasAdBlockStyle}`);
    
    return isAdHidden || hasAdBlockStyle;
  } catch (e) {
    console.error('Error checking for ad blocker:', e);
    return true; // Assume blocker exists if there's an error
  }
};
