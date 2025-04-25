
import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  code: string;
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ code, className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current || !code) return;

    // Clear any previous content
    adRef.current.innerHTML = '';
    
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
  }, [code]);

  return (
    <div 
      ref={adRef} 
      className={`ad-container w-full my-4 overflow-hidden ${className}`}
      data-testid="ad-unit"
    />
  );
};

export default AdUnit;
