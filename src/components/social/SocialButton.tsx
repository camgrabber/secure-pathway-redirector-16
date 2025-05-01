
import React from 'react';
import { Button } from '../ui/button';

interface SocialButtonProps {
  url?: string;
  icon: React.ReactNode;
  title: string;
  bgColor: string;
  hoverColor: string;
}

export const SocialButton = ({ 
  url, 
  icon,
  title,
  bgColor,
  hoverColor
}: SocialButtonProps) => {
  if (!url) return null;
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={`rounded-full bg-${bgColor} hover:bg-${hoverColor} shadow-sm`}
      onClick={() => window.open(url, '_blank')}
      title={title}
    >
      {icon}
    </Button>
  );
};
