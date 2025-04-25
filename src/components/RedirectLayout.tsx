
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import AdUnit from './AdUnit';
import { useAdManager } from '../utils/adManager';

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
  const topAds = getActiveAdsByPosition('top');
  const middleAds = getActiveAdsByPosition('middle');
  const bottomAds = getActiveAdsByPosition('bottom');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
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
                <AdUnit key={ad.id} code={ad.code} position="top" />
              ))}
            </div>
          )}
          
          {/* Main content */}
          {children}
          
          {/* Middle ad placement */}
          {middleAds.length > 0 && (
            <div className="ad-section-middle">
              {middleAds.map(ad => (
                <AdUnit key={ad.id} code={ad.code} position="middle" />
              ))}
            </div>
          )}
        </div>
        
        <div className="px-6 pb-6">
          <div className="security-badge">
            <ShieldCheck className="text-redirector-success" />
            <span>100% Secure Redirection Service</span>
          </div>
          
          {/* Bottom ad placement */}
          {bottomAds.length > 0 && (
            <div className="ad-section-bottom">
              {bottomAds.map(ad => (
                <AdUnit key={ad.id} code={ad.code} position="bottom" />
              ))}
            </div>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our <a href="#" className="text-redirector-primary hover:underline">Terms of Service</a> and <a href="#" className="text-redirector-primary hover:underline">Privacy Policy</a></p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Secure Pathway Redirector. All rights reserved.
      </div>
    </div>
  );
};

export default RedirectLayout;
