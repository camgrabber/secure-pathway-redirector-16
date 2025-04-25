
// Advanced ad blocker detection with multiple reliable detection methods
export const checkForAdBlocker = async (): Promise<boolean> => {
  try {
    console.log("Running enhanced adblock detection...");
    
    const results: boolean[] = [];
    
    // Method 1: Create and check multiple bait elements with known ad blocker targets
    const adClassNames = [
      'adsbox', 'ad-slot', 'ad-banner', 'googlead', 'adsense', 'advert',
      'adsbygoogle', 'ad-container', 'ad-wrapper', 'sponsor-unit'
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
        console.log(`Adblock detected: Bait element '${className}' was hidden`);
        results.push(true);
      }
    }
    
    // Method 2: Try to fetch multiple known ad network resources
    const adUrls = [
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
      'https://www.googletagservices.com/tag/js/gpt.js',
      'https://ad.doubleclick.net/ddm/adj'
    ];
    
    const fetchPromises = adUrls.map(url => {
      return fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(1000)
      })
      .then(() => false)
      .catch((error) => {
        console.log(`Ad fetch blocked for ${url}: ${error.message}`);
        return true; // Fetch was blocked
      });
    });
    
    const fetchResults = await Promise.all(fetchPromises);
    const isAnyFetchBlocked = fetchResults.some(result => result === true);
    
    if (isAnyFetchBlocked) {
      console.log('Adblock detected: Ad resource fetch was blocked');
      results.push(true);
    }
    
    // Method 3: Check for common ad blocker extensions and styles
    const hasAdBlockStyles = !!document.getElementById('AdBlocker-detector') ||
                           !!document.getElementById('AdBlock-detector') ||
                           !!document.getElementById('ad-blocker-overlay') ||
                           !!document.querySelector('[id*="AdBlock"]') ||
                           !!document.querySelector('[class*="adblock"]');
    
    if (hasAdBlockStyles) {
      console.log('Adblock detected: Ad blocker styles found in page');
      results.push(true);
    }
    
    // Method 4: Create a fake ad iframe
    const adIframe = document.createElement('iframe');
    adIframe.src = 'about:blank';
    adIframe.width = '1';
    adIframe.height = '1';
    adIframe.id = 'ad-detection-frame';
    adIframe.style.position = 'absolute';
    adIframe.style.bottom = '-100px';
    document.body.appendChild(adIframe);
    
    // Try to write ad-like content to the iframe
    try {
      const iframeDoc = adIframe.contentDocument || adIframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.body.innerHTML = '<div class="adsbygoogle" style="height:10px;"></div>';
      }
    } catch (error) {
      console.log('Adblock detected: Unable to write to ad iframe');
      results.push(true);
    }
    
    // Clean up iframe
    setTimeout(() => {
      if (document.body.contains(adIframe)) {
        document.body.removeChild(adIframe);
      }
    }, 500);
    
    // Method 5: Try to create a bait script element
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = 'https://pagead2.googlesyndication.com/pagead/show_ads.js';
    adScript.onerror = () => {
      console.log('Adblock detected: Ad script load error');
      results.push(true);
    };
    document.body.appendChild(adScript);
    
    // Clean up script after a short delay
    setTimeout(() => {
      if (document.body.contains(adScript)) {
        document.body.removeChild(adScript);
      }
    }, 1000);
    
    // Final check: we need to wait for all checks to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const isAdBlockerDetected = results.length > 0;
    console.log(`Final adblock detection result: ${isAdBlockerDetected ? "BLOCKED" : "NOT BLOCKED"}`);
    return isAdBlockerDetected;
  } catch (e) {
    console.error('Error in enhanced adblock detection:', e);
    return true; // Assume blocker exists if there's an error
  }
};
