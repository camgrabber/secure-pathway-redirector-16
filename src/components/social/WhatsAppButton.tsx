
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  url: string;
}

export const WhatsAppButton = ({ url }: WhatsAppButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="rounded-full bg-white hover:bg-green-50"
      onClick={() => window.open(url, '_blank')}
      title="WhatsApp"
    >
      <MessageCircle className="h-5 w-5 text-green-500" />
    </Button>
  );
};
