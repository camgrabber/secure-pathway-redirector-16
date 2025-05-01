
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsManager } from '@/utils/settingsManager';

const Index = () => {
  const navigate = useNavigate();
  const { settings, isLoaded } = useSettingsManager();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    // Only proceed with redirection if settings are loaded
    if (!isLoaded) {
      console.log("Index: Waiting for settings to load...");
      return;
    }
    
    if (isRedirecting) {
      return; // Prevent multiple redirects
    }
    
    setIsRedirecting(true);
    
    // Get the URL from query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const destinationUrl = queryParams.get('url');
    
    console.log("Index: Settings loaded, redirecting with default URL:", settings.defaultDestinationUrl);
    
    // Use state to pass the URL instead of query parameters
    navigate('/initial-redirect', {
      state: { 
        url: destinationUrl || settings.defaultDestinationUrl || 'https://example.com'
      }
    });
  }, [navigate, settings.defaultDestinationUrl, isLoaded, isRedirecting]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-redirector-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Initializing Secure Redirect...</p>
        {!isLoaded && <p className="text-sm text-gray-400 mt-2">Loading settings...</p>}
      </div>
    </div>
  );
};

export default Index;
