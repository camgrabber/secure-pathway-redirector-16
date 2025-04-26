
import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { toast } from './ui/sonner';

export const AdBlockerDetected = ({ onContinueAnyway }: { onContinueAnyway: () => void }) => {
  const [isReloading, setIsReloading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleContinue = () => {
    toast.info("Continuing with limited functionality", {
      description: "Some features may not work correctly without ad capability"
    });
    onContinueAnyway();
    setDismissed(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-500">
      <Alert variant="destructive" className="relative shadow-lg">
        <AlertCircle className="h-5 w-5" />
        <X 
          className="absolute top-2 right-2 h-4 w-4 cursor-pointer opacity-70 hover:opacity-100" 
          onClick={handleDismiss}
        />
        <AlertDescription className="ml-2">
          <div className="flex flex-col gap-3">
            <AlertTitle className="text-sm font-semibold">Ad blocker may be active</AlertTitle>
            <p className="text-sm">This site requires ad capability to function properly. We've detected that your browser might be blocking ads.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button 
                onClick={handleReload} 
                className="bg-white text-destructive hover:bg-gray-100"
                disabled={isReloading}
              >
                {isReloading ? 'Reloading...' : 'Try Again'}
              </Button>
              <Button 
                onClick={handleContinue}
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                Continue Anyway
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
