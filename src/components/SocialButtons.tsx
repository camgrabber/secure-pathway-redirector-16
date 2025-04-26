
import React from 'react';
import { Instagram, Twitter, WhatsApp } from 'lucide-react';
import { Button } from './ui/button';
import { useSettingsManager } from '@/utils/settingsManager';

export const SocialButtons = () => {
  const { settings } = useSettingsManager();

  const openUrl = (url: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="fixed right-4 bottom-4 flex flex-col gap-2 z-50">
      {settings.whatsappUrl && (
        <Button
          onClick={() => openUrl(settings.whatsappUrl)}
          size="icon"
          className="rounded-full bg-green-500 hover:bg-green-600 text-white"
        >
          <WhatsApp className="h-5 w-5" />
        </Button>
      )}
      
      {settings.instagramUrl && (
        <Button
          onClick={() => openUrl(settings.instagramUrl)}
          size="icon"
          className="rounded-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          <Instagram className="h-5 w-5" />
        </Button>
      )}
      
      {settings.twitterUrl && (
        <Button
          onClick={() => openUrl(settings.twitterUrl)}
          size="icon"
          className="rounded-full bg-blue-400 hover:bg-blue-500 text-white"
        >
          <Twitter className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
