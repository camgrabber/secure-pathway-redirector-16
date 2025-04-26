
import React from 'react';
import { Button } from '../ui/button';

interface SocialButtonProps {
  url?: string;
  color: string;
  hoverColor: string;
  shadowColor: string;
  children: React.ReactNode;
  gradientColors?: string[];
}

export const SocialButton = ({ 
  url, 
  color, 
  hoverColor, 
  shadowColor, 
  children,
  gradientColors 
}: SocialButtonProps) => {
  const handleClick = () => {
    if (url) window.open(url, '_blank');
  };

  const baseClasses = "rounded-full hover:scale-110 transform transition-all duration-300 text-white shadow-lg w-12 h-12";
  const bgClasses = gradientColors 
    ? `bg-gradient-to-br from-${gradientColors[0]} via-${gradientColors[1]} to-${gradientColors[2]} hover:from-${gradientColors[0]}/90 hover:via-${gradientColors[1]}/90 hover:to-${gradientColors[2]}/90`
    : `bg-${color} hover:bg-${hoverColor}`;
  
  return url ? (
    <Button
      onClick={handleClick}
      size="icon"
      className={`${baseClasses} ${bgClasses} hover:shadow-${shadowColor}/50`}
    >
      {children}
    </Button>
  ) : null;
};
