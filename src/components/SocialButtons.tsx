
import React from 'react';
import { MessageCircle, Instagram, Twitter } from 'lucide-react';
import { Button } from './ui/button';
import { useSettingsManager } from '@/utils/settingsManager';

export const SocialButtons = () => {
  const { settings } = useSettingsManager();

  const openUrl = (url: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="fixed right-4 bottom-4 flex flex-col gap-3 z-50">
      {settings.whatsappUrl && (
        <Button
          onClick={() => openUrl(settings.whatsappUrl)}
          size="icon"
          className="rounded-full bg-green-500 hover:bg-green-600 hover:scale-110 transform transition-all duration-300 text-white shadow-lg hover:shadow-green-500/50"
        >
          <MessageCircle className="h-5 w-5 animate-bounce-small" />
        </Button>
      )}
      
      {settings.instagramUrl && (
        <Button
          onClick={() => openUrl(settings.instagramUrl)}
          size="icon"
          className="rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 hover:scale-110 transform transition-all duration-300 text-white shadow-lg hover:shadow-pink-500/50"
        >
          <Instagram className="h-5 w-5 animate-bounce-small" />
        </Button>
      )}
      
      {settings.twitterUrl && (
        <Button
          onClick={() => openUrl(settings.twitterUrl)}
          size="icon"
          className="rounded-full bg-blue-400 hover:bg-blue-500 hover:scale-110 transform transition-all duration-300 text-white shadow-lg hover:shadow-blue-400/50"
        >
          <Twitter className="h-5 w-5 animate-bounce-small" />
        </Button>
      )}
    </div>
  );
};

