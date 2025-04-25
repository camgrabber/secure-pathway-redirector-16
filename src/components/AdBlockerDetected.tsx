
import React, { useState } from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export const AdBlockerDetected = () => {
  const [isReloading, setIsReloading] = useState(false);
  
  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ad Blocker Detected</h2>
          <p className="text-gray-600 mb-4">
            We've detected that you're using an ad blocker. Our service is supported by 
            advertisements. Please disable your ad blocker to continue.
          </p>
          
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Our site won't work with ad blockers</AlertTitle>
            <AlertDescription>
              The content delivery system requires ads to function properly.
            </AlertDescription>
          </Alert>
          
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 text-left mb-4">
            <p className="text-sm">
              <strong>How to disable your ad blocker:</strong><br/>
              1. Look for the ad blocker icon in your browser's toolbar<br/>
              2. Click on it and select "Pause" or "Disable" for this site<br/>
              3. Reload the page using the button below
            </p>
          </div>
          
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Why are ads necessary?</AlertTitle>
            <AlertDescription>
              Ads help us keep our services free for all users. We appreciate your understanding.
            </AlertDescription>
          </Alert>
        </div>
        
        <Button 
          onClick={handleReload} 
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isReloading}
        >
          {isReloading ? 'Reloading...' : 'Reload Page'}
        </Button>
      </div>
    </div>
  );
};
