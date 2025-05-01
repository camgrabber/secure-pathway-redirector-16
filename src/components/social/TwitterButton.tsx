
import React from 'react';
import { Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TwitterButtonProps {
  url: string;
}

export const TwitterButton = ({ url }: TwitterButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="rounded-full bg-white hover:bg-blue-50"
      onClick={() => window.open(url, '_blank')}
      title="Twitter"
    >
      <Twitter className="h-5 w-5 text-blue-400" />
    </Button>
  );
};
