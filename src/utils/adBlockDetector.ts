
// Simple and reliable adblocker detection
export const checkForAdBlocker = async (): Promise<boolean> => {
  try {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    document.body.appendChild(testAd);
    
    // Wait a brief moment for adblockers to process the element
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const isBlocked = testAd.offsetHeight === 0;
    document.body.removeChild(testAd);
    return isBlocked;
  } catch (e) {
    console.error('Error checking for ad blocker:', e);
    return true; // Assume blocker exists if there's an error
  }
};
