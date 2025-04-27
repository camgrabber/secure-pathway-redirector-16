
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get the URL from query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const destinationUrl = queryParams.get('url');
    
    // Use state to pass the URL instead of query parameters
    navigate('/initial-redirect', {
      state: { 
        url: destinationUrl || 'https://example.com'
      }
    });
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-redirector-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Initializing Secure Redirect...</p>
      </div>
    </div>
  );
};

export default Index;
