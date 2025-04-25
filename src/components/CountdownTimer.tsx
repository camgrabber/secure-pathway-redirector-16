
import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
  showCheckOnComplete?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  seconds = 10, 
  onComplete,
  showCheckOnComplete = true
}) => {
  const [countdown, setCountdown] = useState(seconds);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (countdown <= 0) {
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, onComplete]);
  
  // Calculate progress percentage for the timer circle
  const progressPercent = ((seconds - countdown) / seconds) * 100;
  
  return (
    <div className="text-center animate-fade-in">
      <div 
        className="timer-circle"
        style={{ 
          background: isComplete 
            ? `conic-gradient(#06d6a0 100%, #e9ecef 0%)` 
            : `conic-gradient(#4361ee ${progressPercent}%, #e9ecef 0%)` 
        }}
      >
        {!isComplete ? (
          <span className="relative z-10 text-3xl font-bold text-redirector-primary">
            {countdown}
          </span>
        ) : (
          showCheckOnComplete && (
            <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-redirector-success rounded-full">
              <Check className="w-8 h-8 text-white" />
            </div>
          )
        )}
      </div>
      <p className="mt-2 text-lg font-semibold text-gray-700">
        {isComplete ? 'Verification Complete' : 'Verifying your link...'}
      </p>
    </div>
  );
};

export default CountdownTimer;
