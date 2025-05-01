
// Advanced ad blocker detection with multiple reliable detection methods
export const checkForAdBlocker = async (): Promise<boolean> => {
  try {
    console.log("Running enhanced adblock detection...");
    
    const results: boolean[] = [];
    let detectionCount = 0;
    
    // Method 1: Create and check bait elements with known ad blocker targets
    // Using fewer class names to reduce false positives
    const adClassNames = [
      'adsbox', 'ad-banner', 'adsbygoogle', 'ad-container',
      'ad-placeholder', 'sponsored-content', 'advertisement'
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
    
    // Method 2: Try to fetch known ad network resources
    const adResources = [
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      'https://securepubads.g.doubleclick.net/tag/js/gpt.js'
    ];
    
    for (const resource of adResources) {
      try {
        const response = await fetch(resource, { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: AbortSignal.timeout(500) // Shorter timeout
        });
      } catch (error) {
        console.log(`Ad fetch blocked: ${resource}`);
        detectionCount++;
      }
    }
    
    // Method 3: Check for common ad blocker browser extensions
    const checkForAdBlockExtensions = () => {
      // Detect if window has been modified by ad blockers
      const hasBlockerProperty = (
        'adBlocker' in window || 
        'AdBlock' in window || 
        'adblock' in window || 
        'blockAdBlock' in window
      );
      
      if (hasBlockerProperty) {
        detectionCount++;
        console.log("Ad blocker extension property detected");
      }
    };
    
    checkForAdBlockExtensions();
    
    // Only report ad blocker if multiple detection methods confirm it
    // This reduces false positives
    const isAdBlockerDetected = detectionCount >= 2; // Need at least 2 confirmations
    
    console.log(`Final adblock detection result: ${isAdBlockerDetected ? "BLOCKED" : "NOT BLOCKED"} (${detectionCount} indicators)`);
    return isAdBlockerDetected;
  } catch (e) {
    console.error('Error in enhanced adblock detection:', e);
    return false; // Don't assume blocker exists if there's an error
  }
};

// Run ad blocker detection when module loads to initialize early
checkForAdBlocker().then(detected => {
  console.log("Initial adblock check result:", detected);
  if (detected) {
    // Trigger event for other parts of the app to listen for
    window.dispatchEvent(new CustomEvent('adBlockerDetected'));
  }
});
