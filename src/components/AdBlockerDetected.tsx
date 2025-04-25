
import React, { useState, useEffect } from 'react';
import { AlertCircle, Info, RefreshCw, X } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export const AdBlockerDetected = () => {
  const [isReloading, setIsReloading] = useState(false);
  const [detectedBlockers, setDetectedBlockers] = useState<string[]>([]);
  
  useEffect(() => {
    // Try to detect specific ad blockers
    const detectSpecificBlockers = () => {
      const possibleBlockers: string[] = [];
      
      // Check for AdBlock
      if (document.getElementById('AdBlock-detector') || 
          document.querySelector('[id*="AdBlock"]')) {
        possibleBlockers.push('AdBlock');
      }
      
      // Check for uBlock Origin
      if (document.getElementById('ublock-origin-detector') ||
          document.querySelector('div[class*="uBlock"]')) {
        possibleBlockers.push('uBlock Origin');
      }
      
      // Check for AdGuard
      if (document.getElementById('adguard-detector') ||
          document.querySelector('div[id*="adguard"]')) {
        possibleBlockers.push('AdGuard');
      }
      
      // Generic detection
      if (possibleBlockers.length === 0) {
        possibleBlockers.push('Ad Blocker');
      }
      
      setDetectedBlockers(possibleBlockers);
    };
    
    detectSpecificBlockers();
  }, []);
  
  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 text-center relative animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Ad Blocker Detected</h2>
          <p className="text-gray-600 mb-5">
            We've detected that you're using {detectedBlockers.join(' or ')}. Our service requires 
            ad display capability to function properly. Please disable your ad blocker or add this site to your allowlist.
          </p>
          
          <Alert variant="destructive" className="mb-5 text-left">
            <AlertTitle className="flex items-center gap-2">
              <X className="h-4 w-4" /> This site won't work with ad blockers
            </AlertTitle>
            <AlertDescription>
              Our content delivery system requires ad capability to function properly. Without this, 
              you won't be able to access the intended destination.
            </AlertDescription>
          </Alert>
          
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 text-left mb-5">
            <p className="font-semibold mb-2">How to disable your ad blocker:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Look for the ad blocker icon in your browser's toolbar/extensions area</li>
              <li>Click on it and select "Pause" or "Disable" for this site</li>
              <li>If using a DNS-level blocker (like Pi-hole), temporarily disable it</li>
              <li>Reload the page using the button below</li>
            </ol>
          </div>
          
          <Alert className="mb-5 text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>Why are ads necessary?</AlertTitle>
            <AlertDescription>
              Ads support our free service and enable us to maintain this redirect system. We use safe, non-intrusive 
              advertisements that won't harm your browsing experience.
            </AlertDescription>
          </Alert>
        </div>
        
        <Button 
          onClick={handleReload} 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 flex items-center justify-center gap-2"
          disabled={isReloading}
        >
          {isReloading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Reloading...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </>
          )}
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          If you continue having issues, try using a different browser or device.
        </p>
      </div>
    </div>
  );
};
