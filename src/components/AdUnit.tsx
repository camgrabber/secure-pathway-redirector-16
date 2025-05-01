
import React, { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  code: string;
  className?: string;
  position?: 'top' | 'middle' | 'bottom' | 'after-timer' | 'sticky' | 'interstitial';
  priority?: 'high' | 'normal' | 'low';
}

const AdUnit: React.FC<AdUnitProps> = ({ 
  code, 
  className = "", 
  position = "middle",
  priority = "normal" 
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Ensure we have both the ref and ad code to work with
    if (!adRef.current || !code) return;
    
    // Create a function to initialize the ad
    const initializeAd = () => {
      try {
        // Clear any previous content
        if (adRef.current) {
          adRef.current.innerHTML = '';
          setIsLoaded(false);
          setHasError(false);
          
          // Create a div to hold the ad
          const adContainer = document.createElement('div');
          adContainer.innerHTML = code;
          
          // Append the ad container to our component
          adRef.current.appendChild(adContainer);
          
          // Execute any scripts within the ad code
          const scripts = adContainer.getElementsByTagName('script');
          Array.from(scripts).forEach(oldScript => {
            const newScript = document.createElement('script');
            
            Array.from(oldScript.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value);
            });
            
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode?.replaceChild(newScript, oldScript);
          });
          
          console.log(`Ad initialized at position: ${position} with priority: ${priority}`);
          
          // Mark as loaded after a brief delay to allow scripts to execute
          setTimeout(() => {
            setIsLoaded(true);
          }, 500);
        }
      } catch (error) {
        console.error('Error initializing ad:', error);
        setHasError(true);
      }
    };

    // Set loading delay based on priority
    const loadingDelay = priority === 'high' ? 100 : priority === 'normal' ? 300 : 500;

    // Initialize the ad with a delay based on priority
    const timer = setTimeout(() => {
      initializeAd();
    }, loadingDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [code, position, priority]);

  // Apply different styling based on position
  const getPositionClass = () => {
    switch (position) {
      case 'top': return 'mb-6';
      case 'middle': return 'my-6';
      case 'bottom': return 'mt-6';
      case 'after-timer': return 'my-4';
      case 'sticky': return 'sticky top-0 z-50 my-2';
      case 'interstitial': return 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70';
      default: return 'my-4';
    }
  };

  return (
    <div 
      ref={adRef} 
      className={`ad-container w-full overflow-hidden border border-gray-200 rounded-lg bg-gray-50 ${getPositionClass()} ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 min-h-[100px]`}
      data-testid="ad-unit"
      data-ad-position={position}
      data-ad-priority={priority}
      data-ad-status={hasError ? 'error' : isLoaded ? 'loaded' : 'loading'}
    />
  );
};

export default AdUnit;
