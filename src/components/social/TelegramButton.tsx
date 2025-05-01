
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TelegramButtonProps {
  url: string;
}

export const TelegramButton = ({ url }: TelegramButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="rounded-full bg-white hover:bg-blue-50"
      onClick={() => window.open(url, '_blank')}
      title="Telegram"
    >
      <Send className="h-5 w-5 text-blue-500" />
    </Button>
  );
};
