
import React from 'react';
import { WhatsAppButton } from './social/WhatsAppButton';
import { InstagramButton } from './social/InstagramButton';
import { TelegramButton } from './social/TelegramButton';
import { TwitterButton } from './social/TwitterButton';
import { useSettingsManager } from '@/utils/settingsManager';

export const SocialButtons = () => {
  const { settings } = useSettingsManager();
  
  // Check if we have any social links to display
  const hasSocialLinks = settings.whatsappUrl || settings.instagramUrl || 
                         settings.telegramUrl || settings.twitterUrl;
  
  if (!hasSocialLinks) return null;
  
  return (
    <div className="fixed top-4 right-4 flex gap-2 z-10">
      <div className="flex gap-2">
        {settings.whatsappUrl && <WhatsAppButton url={settings.whatsappUrl} />}
        {settings.instagramUrl && <InstagramButton url={settings.instagramUrl} />}
        {settings.telegramUrl && <TelegramButton url={settings.telegramUrl} />}
        {settings.twitterUrl && <TwitterButton url={settings.twitterUrl} />}
      </div>
    </div>
  );
};
