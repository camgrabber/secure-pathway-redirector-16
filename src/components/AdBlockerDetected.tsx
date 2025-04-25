
import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

export const AdBlockerDetected = () => {
  const [isReloading, setIsReloading] = useState(false);
  
  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Alert variant="destructive" className="relative shadow-lg">
        <AlertCircle className="h-5 w-5" />
        <AlertDescription className="ml-2">
          <div className="flex flex-col gap-3">
            <p className="font-semibold">Please disable your ad blocker</p>
            <p className="text-sm">This site requires ad capability to function properly.</p>
            <Button 
              onClick={handleReload} 
              className="w-full bg-white text-destructive hover:bg-gray-100"
              disabled={isReloading}
            >
              {isReloading ? 'Reloading...' : 'Try Again'}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

