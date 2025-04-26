
// Advanced ad blocker detection with multiple reliable detection methods
export const checkForAdBlocker = async (): Promise<boolean> => {
  try {
    console.log("Running enhanced adblock detection...");
    
    const results: boolean[] = [];
    let detectionCount = 0;
    
    // Method 1: Create and check bait elements with known ad blocker targets
    // Using fewer class names to reduce false positives
    const adClassNames = [
      'adsbox', 'ad-banner', 'adsbygoogle', 'ad-container'
    ];
    
    for (const className of adClassNames) {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = className;
      testAd.style.height = '1px';
      testAd.style.position = 'absolute';
      testAd.style.bottom = '-1px';
      document.body.appendChild(testAd);
      
      // Store references to remove later
      setTimeout(() => {
        if (document.body.contains(testAd)) {
          document.body.removeChild(testAd);
        }
      }, 500);
      
      // Check if element is hidden or altered
      const elemResult = !testAd.offsetHeight || 
                         window.getComputedStyle(testAd).display === 'none' || 
                         window.getComputedStyle(testAd).visibility === 'hidden';
      
      if (elemResult) {
        console.log(`Adblock detection: Bait element '${className}' was hidden`);
        detectionCount++;
      }
    }
    
    // Method 2: Try to fetch a known ad network resource
    // Only check one resource instead of multiple to reduce false positives
    try {
      const response = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(500) // Shorter timeout
      });
    } catch (error) {
      console.log(`Ad fetch blocked: ${error.message}`);
      detectionCount++;
    }
    
    // Only report ad blocker if multiple detection methods confirm it
    // This reduces false positives
    const isAdBlockerDetected = detectionCount >= 2; // Need at least 2 confirmations
    
    console.log(`Final adblock detection result: ${isAdBlockerDetected ? "BLOCKED" : "NOT BLOCKED"}`);
    return isAdBlockerDetected;
  } catch (e) {
    console.error('Error in enhanced adblock detection:', e);
    return false; // Don't assume blocker exists if there's an error
  }
};
