
import React from 'react';
import { Button } from './ui/button';
import { useSettingsManager } from '@/utils/settingsManager';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { TelegramIcon } from './icons/TelegramIcon';

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
          className="rounded-full bg-[#25D366] hover:bg-[#128C7E] hover:scale-110 transform transition-all duration-300 text-white shadow-lg hover:shadow-[#25D366]/50"
        >
          <WhatsappIcon className="h-5 w-5 animate-bounce-small" />
        </Button>
      )}
      
      {settings.instagramUrl && (
        <Button
          onClick={() => openUrl(settings.instagramUrl)}
          size="icon"
          className="rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:from-[#833AB4]/90 hover:via-[#FD1D1D]/90 hover:to-[#F77737]/90 hover:scale-110 transform transition-all duration-300 text-white shadow-lg hover:shadow-[#833AB4]/50"
        >
          <InstagramIcon className="h-5 w-5 animate-bounce-small" />
        </Button>
      )}
      
      {settings.twitterUrl && (
        <Button
          onClick={() => openUrl(settings.twitterUrl)}
          size="icon"
          className="rounded-full bg-black hover:bg-black/90 hover:scale-110 transform transition-all duration-300 text-white shadow-lg hover:shadow-black/50"
        >
          <TwitterIcon className="h-5 w-5 animate-bounce-small" />
        </Button>
      )}

      {settings.telegramUrl && (
        <Button
          onClick={() => openUrl(settings.telegramUrl)}
          size="icon"
          className="rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 hover:scale-110 transform transition-all duration-300 text-white shadow-lg hover:shadow-[#0088cc]/50"
        >
          <TelegramIcon className="h-5 w-5 animate-bounce-small" />
        </Button>
      )}
    </div>
  );
};
