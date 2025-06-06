
import React, { useState } from 'react';
import { AlertTriangle, X, ShieldX } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from './ui/sonner';
import { forceCheckForAdBlocker } from '../utils/adBlockDetector';

export const AdBlockerDetected = ({ onContinueAnyway }: { onContinueAnyway: () => void }) => {
  const [isReloading, setIsReloading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    // Recheck if ad blocker is still active
    const stillBlocked = await forceCheckForAdBlocker();
    
    setIsVerifying(false);
    if (stillBlocked) {
      toast.error("Ad blocker is still active", {
        description: "Please disable your ad blocker and try again"
      });
    } else {
      toast.success("Ad blocker disabled successfully", {
        description: "You can now continue browsing"
      });
      onContinueAnyway();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="mx-auto rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mb-4">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Ad Blocker Detected</h2>
          <p className="text-gray-600">
            This site requires ad capability to function properly. We've detected that your browser is blocking ads.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={handleReload} 
            className="w-full"
            disabled={isReloading}
          >
            {isReloading ? 'Reloading...' : 'Disable Ad Blocker & Reload Page'}
          </Button>
          
          <Button 
            onClick={handleVerify} 
            variant="secondary" 
            className="w-full"
            disabled={isVerifying}
          >
            {isVerifying ? 'Checking...' : 'I\'ve Disabled My Ad Blocker'}
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-2">
            Please disable your ad blocker to ensure full functionality and support our service.
          </p>
        </div>
      </div>
    </div>
  );
};
