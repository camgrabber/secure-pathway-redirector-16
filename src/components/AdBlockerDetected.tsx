
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

export const AdBlockerDetected = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ad Blocker Detected</h2>
          <p className="text-gray-600">
            Please disable your ad blocker to continue using this website. We rely on 
            advertisements to keep our service free.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            After disabling your ad blocker, click the button below to reload the page:
          </div>
          <Button onClick={handleReload} className="w-full">
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
};
