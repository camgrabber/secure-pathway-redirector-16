import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';
import RedirectLayout from '../components/RedirectLayout';
import SecurityScan from '../components/SecurityScan';
import { Button } from '../components/ui/button';
import { useSettingsManager } from '../utils/settingsManager';

const SecurityCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scanComplete, setScanComplete] = useState(false);
  const [isSecure, setIsSecure] = useState(false);
  const { settings } = useSettingsManager();
  
  const destinationUrl = location.state?.url || settings.defaultDestinationUrl;
  
  const handleScanComplete = (securityResult: boolean) => {
    setScanComplete(true);
    setIsSecure(securityResult);
  };
  
  const handleContinue = () => {
    // Pass URL through state
    navigate('/confirmation', { state: { url: destinationUrl } });
  };
  
  return (
    <RedirectLayout
      title={settings.securityTitle}
      subtitle={settings.securitySubtitle}
    >
      <div className="space-y-8 py-4">
        {!scanComplete ? (
          <SecurityScan 
            durationMs={settings.securityScanDurationMs}
            onComplete={handleScanComplete}
            url={destinationUrl}
          />
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-2 rounded-full bg-green-50">
              <Shield className="w-10 h-10 text-redirector-success" />
            </div>
            
            <h3 className="text-xl font-bold">
              {isSecure ? 'Link Verified Safe' : 'Security Check Complete'}
            </h3>
            
            <p className="text-gray-600 max-w-md mx-auto">
              {isSecure 
                ? 'Our security scan has determined this link is safe to visit. You may proceed to the final confirmation.'
                : 'We\'ve completed our security check. You may proceed, but exercise caution when visiting this site.'}
            </p>
            
            <Button 
              onClick={handleContinue}
              className={`px-8 py-6 text-lg ${
                isSecure 
                  ? 'bg-gradient-to-r from-redirector-success to-green-500' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              } hover:opacity-90 transition-opacity`}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              {settings.securityButtonText}
            </Button>
          </div>
        )}
      </div>
    </RedirectLayout>
  );
};

export default SecurityCheck;
