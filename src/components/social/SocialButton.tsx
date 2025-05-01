
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
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
    console.log(`SocialButton: Opening ${title} link: ${url}`);
  };
  
  // Use tailwind classes directly instead of template literals
  const buttonClass = `rounded-full shadow-sm ${
    bgColor === 'white' ? 'bg-white' : `bg-${bgColor}`
  } ${
    hoverColor === 'blue-50' ? 'hover:bg-blue-50' : 
    hoverColor === 'green-50' ? 'hover:bg-green-50' : 
    hoverColor === 'pink-50' ? 'hover:bg-pink-50' : 
    'hover:bg-gray-50'
  }`;
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={buttonClass}
      onClick={handleClick}
      title={title}
      aria-label={title}
    >
      {icon}
    </Button>
  );
};
