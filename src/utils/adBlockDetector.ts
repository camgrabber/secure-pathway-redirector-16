
// Enhanced ad blocker detection with multiple detection methods
export const checkForAdBlocker = async (): Promise<boolean> => {
  try {
    // Method 1: Create a bait element
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox ad-element';
    document.body.appendChild(testAd);
    
    // Method 2: Try to load a "bait" script
    const baitScript = document.createElement('script');
    baitScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    baitScript.async = true;
    document.head.appendChild(baitScript);
    
    // Wait for adblockers to process the elements
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if our test ad was hidden or removed
    const isBlockedByHeight = testAd.offsetHeight === 0;
    const isBlockedByDisplay = window.getComputedStyle(testAd).display === 'none';
    
    // Clean up
    document.body.removeChild(testAd);
    document.head.removeChild(baitScript);
    
    return isBlockedByHeight || isBlockedByDisplay;
  } catch (e) {
    console.error('Error checking for ad blocker:', e);
    return true; // Assume blocker exists if there's an error
  }
};
