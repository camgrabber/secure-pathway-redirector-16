
import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  duration: number;
  onComplete?: () => void;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  duration = 3000, 
  onComplete, 
  label = "Loading..." 
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progressPercent = Math.min(100, (elapsedTime / duration) * 100);
      
      setProgress(progressPercent);
      
      if (progressPercent < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration, onComplete]);
  
  return (
    <div className="progress-container">
      <div className="flex justify-between mb-2 text-sm font-semibold">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default ProgressBar;
