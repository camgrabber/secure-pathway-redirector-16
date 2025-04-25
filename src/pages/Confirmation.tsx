
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, ExternalLink, Link } from 'lucide-react';
import RedirectLayout from '../components/RedirectLayout';
import CountdownTimer from '../components/CountdownTimer';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import AdUnit from '../components/AdUnit';
import { useAdManager } from '../utils/adManager';
import { useSettingsManager } from '../utils/settingsManager';

const Confirmation = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [timerComplete, setTimerComplete] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState('');
  const { getActiveAdsByPosition } = useAdManager();
  const { settings } = useSettingsManager();
  const afterTimerAds = getActiveAdsByPosition('after-timer');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const url = params.get('url');
    
    if (url) {
      try {
        const decoded = decodeURIComponent(url);
        setDestinationUrl(decoded);
      } catch (e) {
        console.error('Invalid URL:', e);
        setDestinationUrl(settings.defaultDestinationUrl);
      }
    } else {
      setDestinationUrl(settings.defaultDestinationUrl);
    }
  }, [location.search, settings.defaultDestinationUrl]);

  const handleTimerComplete = () => {
    setTimerComplete(true);
  };

  const handleRedirect = () => {
    // Perform the actual redirect
    window.location.href = destinationUrl;
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(destinationUrl)
      .then(() => {
        toast({
          title: 'Link Copied',
          description: 'Link copied to clipboard successfully',
        });
      })
      .catch(err => {
        console.error('Failed to copy URL:', err);
        toast({
          title: 'Copy Failed',
          description: 'Unable to copy link to clipboard',
          variant: 'destructive',
        });
      });
  };

  return (
    <RedirectLayout
      title={settings.confirmationTitle}
      subtitle={settings.confirmationSubtitle}
    >
      <div className="space-y-8 py-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-green-50 rounded-full">
            <Check className="w-12 h-12 text-redirector-success" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">Destination Verified</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mt-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">You are being redirected to:</p>
            <p className="font-medium text-lg text-redirector-dark">
              Secure Verified Link
            </p>
          </div>
        </div>
        
        {!timerComplete ? (
          <CountdownTimer 
            seconds={settings.confirmationTimerSeconds}
            onComplete={handleTimerComplete}
            showCheckOnComplete={false}
          />
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in">
            {afterTimerAds.length > 0 && (
              <div className="after-timer-ads">
                {afterTimerAds.map(ad => (
                  <AdUnit key={ad.id} code={ad.code} position="after-timer" />
                ))}
              </div>
            )}
            
            <Button 
              onClick={handleRedirect}
              className="px-8 py-6 text-lg bg-gradient-to-r from-redirector-primary to-redirector-secondary hover:opacity-90 transition-opacity animate-scale"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              {settings.confirmationButtonText}
            </Button>
            
            <Button 
              onClick={handleCopy}
              variant="outline"
              className="px-8 py-4"
            >
              <Link className="mr-2 h-4 w-4" />
              {settings.copyLinkButtonText}
            </Button>
          </div>
        )}
      </div>
    </RedirectLayout>
  );
};

export default Confirmation;
