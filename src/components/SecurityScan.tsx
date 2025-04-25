
import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import AdUnit from './AdUnit';
import { useAdManager } from '../utils/adManager';

interface SecurityScanProps {
  durationMs: number;
  onComplete: (isSecure: boolean) => void;
  url?: string;
}

const SecurityScan: React.FC<SecurityScanProps> = ({ 
  durationMs = 5000, 
  onComplete,
  url = "example.com"
}) => {
  const [currentCheck, setCurrentCheck] = useState(0);
  const [checkResults, setCheckResults] = useState<boolean[]>([]);
  const { getActiveAdsByPosition } = useAdManager();
  const middleAds = getActiveAdsByPosition('middle');
  
  const securityChecks = [
    "Checking URL validity",
    "Scanning for malware",
    "Verifying domain reputation",
    "Checking for phishing attempts",
    "Analyzing redirect safety"
  ];

  useEffect(() => {
    if (currentCheck >= securityChecks.length) {
      // All checks complete
      const allPassed = checkResults.every(result => result);
      setTimeout(() => onComplete(allPassed), 1000);
      return;
    }

    const timeout = setTimeout(() => {
      // Simulate a check result (true = passed, false = failed)
      // In a real app, you would perform actual security checks here
      const passed = Math.random() > 0.1; // 90% chance of passing for demo
      setCheckResults(prev => [...prev, passed]);
      setCurrentCheck(prev => prev + 1);
    }, durationMs / securityChecks.length);

    return () => clearTimeout(timeout);
  }, [currentCheck, durationMs, onComplete, checkResults]);
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-blue-50 rounded-full">
          <Shield className="w-10 h-10 text-redirector-primary animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Security Scan in Progress</h3>
        <p className="text-gray-500">Verifying link safety</p>
      </div>
      
      {/* Middle ad placement */}
      {middleAds.length > 0 && (
        <div className="my-6">
          {middleAds.map(ad => (
            <AdUnit key={ad.id} code={ad.code} />
          ))}
        </div>
      )}
      
      <div className="space-y-4">
        {securityChecks.map((check, index) => {
          // Current check is being processed
          const isCurrentCheck = index === currentCheck;
          // Check has been processed
          const isProcessed = index < currentCheck;
          // Result for this check (if processed)
          const result = isProcessed ? checkResults[index] : null;
          
          return (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300
                ${isCurrentCheck ? 'bg-blue-50 shadow-sm' : ''}
                ${isProcessed ? (result ? 'bg-green-50' : 'bg-red-50') : ''}
              `}
            >
              <span className="font-medium">{check}</span>
              <span>
                {isProcessed ? (
                  result ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )
                ) : isCurrentCheck ? (
                  <div className="w-5 h-5 border-2 border-t-redirector-primary border-redirector-primary/30 rounded-full animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-gray-300" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecurityScan;
