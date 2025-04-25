
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This page will simply redirect to the initial redirect page
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the initial redirect page with a default URL
    // In a real application, you might want to read the URL from query parameters
    navigate('/initial-redirect?url=' + encodeURIComponent('https://example.com'));
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
