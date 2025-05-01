
import React from 'react';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InstagramButtonProps {
  url: string;
}

export const InstagramButton = ({ url }: InstagramButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="rounded-full bg-white hover:bg-pink-50"
      onClick={() => window.open(url, '_blank')}
      title="Instagram"
    >
      <Instagram className="h-5 w-5 text-pink-600" />
    </Button>
  );
};
