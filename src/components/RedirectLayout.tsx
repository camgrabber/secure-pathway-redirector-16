
import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import AdUnit from './AdUnit';
import { useAdManager } from '../utils/adManager';
import { useSettingsManager } from '../utils/settingsManager';
import { SocialButtons } from './SocialButtons';

interface RedirectLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const RedirectLayout: React.FC<RedirectLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  const { getActiveAdsByPosition } = useAdManager();
  const { settings } = useSettingsManager();
  const [hasInterstitialShown, setHasInterstitialShown] = useState(false);
  
  const topAds = getActiveAdsByPosition('top');
  const middleAds = getActiveAdsByPosition('middle');
  const bottomAds = getActiveAdsByPosition('bottom');
  const stickyAds = getActiveAdsByPosition('sticky');
  const interstitialAds = getActiveAdsByPosition('interstitial');
  
  useEffect(() => {
    // Log active ads for debugging purposes
    console.log('Active ads by position:');
    console.log('- Top ads:', topAds);
    console.log('- Middle ads:', middleAds);
    console.log('- Bottom ads:', bottomAds);
    console.log('- Sticky ads:', stickyAds);
    console.log('- Interstitial ads:', interstitialAds);
    
    // Show interstitial ad once per session
    if (interstitialAds.length > 0 && !hasInterstitialShown) {
      // Delay interstitial to not interfere with page load
      const timer = setTimeout(() => {
        setHasInterstitialShown(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [topAds, middleAds, bottomAds, stickyAds, interstitialAds, hasInterstitialShown]);

  // Handle interstitial close
  const closeInterstitial = () => {
    setHasInterstitialShown(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <SocialButtons />
      
      {/* Sticky ads at the top of the page */}
      {stickyAds.length > 0 && (
        <div className="w-full max-w-xl mb-4">
          {stickyAds.map(ad => (
            <AdUnit key={ad.id} code={ad.code} position="sticky" priority="high" />
          ))}
        </div>
      )}
      
      {/* Interstitial full-screen ads */}
      {interstitialAds.length > 0 && !hasInterstitialShown && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative w-full max-w-xl mx-auto p-4">
            <button 
              onClick={closeInterstitial}
              className="absolute top-2 right-2 z-50 bg-white rounded-full p-1 shadow-lg"
              aria-label="Close ad"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            {interstitialAds.map(ad => (
              <AdUnit key={ad.id} code={ad.code} position="interstitial" priority="high" className="relative z-40" />
            ))}
          </div>
        </div>
      )}
      
      <div className="card-container w-full max-w-xl bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="card-header">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="opacity-90">{subtitle}</p>}
        </div>
        
        <div className="card-content">
          {/* Top ad placement */}
          {topAds.length > 0 && (
            <div className="ad-section-top">
              {topAds.map(ad => (
                <AdUnit key={ad.id} code={ad.code} position="top" priority="high" />
              ))}
            </div>
          )}
          
          {/* Main content */}
          {children}
          
          {/* Middle ad placement */}
          {middleAds.length > 0 && (
            <div className="ad-section-middle">
              {middleAds.map(ad => (
                <AdUnit key={ad.id} code={ad.code} position="middle" priority="normal" />
              ))}
            </div>
          )}
        </div>
        
        <div className="px-6 pb-6">
          <div className="security-badge">
            <ShieldCheck className="text-redirector-success" />
            <span>{settings.securityBadgeText}</span>
          </div>
          
          {/* Bottom ad placement */}
          {bottomAds.length > 0 && (
            <div className="ad-section-bottom">
              {bottomAds.map(ad => (
                <AdUnit key={ad.id} code={ad.code} position="bottom" priority="low" />
              ))}
            </div>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our <a href="#" className="text-redirector-primary hover:underline">Terms of Service</a> and <a href="#" className="text-redirector-primary hover:underline">Privacy Policy</a></p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        {settings.footerText}
      </div>
    </div>
  );
};

export default RedirectLayout;
