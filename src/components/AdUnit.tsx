
import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  code: string;
  className?: string;
  position?: 'top' | 'middle' | 'bottom' | 'after-timer';
}

const AdUnit: React.FC<AdUnitProps> = ({ code, className = "", position = "middle" }) => {
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

  // Apply different styling based on position
  const getPositionClass = () => {
    switch (position) {
      case 'top': return 'mb-6';
      case 'middle': return 'my-6';
      case 'bottom': return 'mt-6';
      case 'after-timer': return 'my-4';
      default: return 'my-4';
    }
  };

  return (
    <div 
      ref={adRef} 
      className={`ad-container w-full overflow-hidden border border-gray-200 rounded-lg bg-gray-50 ${getPositionClass()} ${className}`}
      data-testid="ad-unit"
      data-ad-position={position}
    />
  );
};

export default AdUnit;
