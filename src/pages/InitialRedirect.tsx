
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import RedirectLayout from '../components/RedirectLayout';
import ProgressBar from '../components/ProgressBar';
import CountdownTimer from '../components/CountdownTimer';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const InitialRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState('');
  
  useEffect(() => {
    // Extract the destination URL from query parameters
    const params = new URLSearchParams(location.search);
    const url = params.get('url');
    
    if (url) {
      try {
        // Store the decoded URL
        setDestinationUrl(decodeURIComponent(url));
      } catch (e) {
        console.error('Invalid URL parameter:', e);
        toast({
          title: 'Error',
          description: 'Invalid URL parameter provided.',
          variant: 'destructive',
        });
      }
    } else {
      // Default URL if none provided
      setDestinationUrl('https://example.com');
    }
  }, [location.search, toast]);

  const handleProgressComplete = () => {
    setLoadingComplete(true);
  };

  const handleTimerComplete = () => {
    setTimerComplete(true);
  };

  const handleContinue = () => {
    // Navigate to security check page and pass the destination URL
    navigate(`/security-check?url=${encodeURIComponent(destinationUrl)}`);
  };

  return (
    <RedirectLayout 
      title="Wait For Secure Link" 
      subtitle="Your secure link is just moments away"
    >
      <div className="space-y-8">
        <ProgressBar 
          duration={3000} 
          onComplete={handleProgressComplete}
          label="Loading Link..."
        />
        
        {loadingComplete && (
          <div className="space-y-8 animate-fade-in">
            <CountdownTimer 
              seconds={10} 
              onComplete={handleTimerComplete}
            />
            
            {timerComplete && (
              <div className="text-center animate-fade-in">
                <Button 
                  onClick={handleContinue}
                  className="px-8 py-6 text-lg bg-gradient-to-r from-redirector-primary to-redirector-primary-dark hover:opacity-90 transition-opacity animate-pulse"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Continue to Security Check
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </RedirectLayout>
  );
};

export default InitialRedirect;
