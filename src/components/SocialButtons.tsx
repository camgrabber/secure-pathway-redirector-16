
import React from 'react';
import { Link } from 'react-router-dom';
import { WhatsAppButton } from './social/WhatsAppButton';
import { InstagramButton } from './social/InstagramButton';
import { TelegramButton } from './social/TelegramButton';
import { TwitterButton } from './social/TwitterButton';
import { useSettingsManager } from '@/utils/settingsManager';

export const SocialButtons = () => {
  const { settings } = useSettingsManager();
  
  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <div className="hidden sm:flex gap-2">
        {settings.whatsappUrl && <WhatsAppButton url={settings.whatsappUrl} />}
        {settings.instagramUrl && <InstagramButton url={settings.instagramUrl} />}
        {settings.telegramUrl && <TelegramButton url={settings.telegramUrl} />}
        {settings.twitterUrl && <TwitterButton url={settings.twitterUrl} />}
      </div>
      
      <Link 
        to="/admin" 
        className="text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center"
        title="Admin Access"
      >
        Admin
      </Link>
    </div>
  );
};
