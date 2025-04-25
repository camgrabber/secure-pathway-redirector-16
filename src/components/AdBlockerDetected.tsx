
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

export const AdBlockerDetected = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center animate-pulse">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ad Blocker Detected</h2>
          <p className="text-gray-600 mb-4">
            We've detected that you're using an ad blocker. Our service is supported by 
            advertisements. Please disable your ad blocker to continue.
          </p>
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 text-left mb-4">
            <p className="text-sm">
              <strong>How to disable your ad blocker:</strong><br/>
              1. Look for the ad blocker icon in your browser's toolbar<br/>
              2. Click on it and select "Pause" or "Disable" for this site<br/>
              3. Reload the page using the button below
            </p>
          </div>
        </div>
        
        <Button onClick={handleReload} className="w-full bg-green-600 hover:bg-green-700">
          Reload Page
        </Button>
      </div>
    </div>
  );
};
