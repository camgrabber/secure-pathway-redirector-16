
import React, { useEffect, useState } from 'react';
import { WhatsAppButton } from './social/WhatsAppButton';
import { InstagramButton } from './social/InstagramButton';
import { TelegramButton } from './social/TelegramButton';
import { TwitterButton } from './social/TwitterButton';
import { useSettingsManager } from '@/utils/settingsManager';

export const SocialButtons = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings, refreshSettings } = useSettingsManager();
  
  // Force refresh settings when component mounts to ensure we have the latest data
  useEffect(() => {
    const loadSocialData = async () => {
      try {
        console.log('SocialButtons: Refreshing settings on mount');
        await refreshSettings();
        setIsLoaded(true);
      } catch (error) {
        console.error('SocialButtons: Error refreshing settings', error);
        setIsLoaded(true); // Set loaded anyway to show UI
      }
    };
    
    loadSocialData();
    
    // Refresh social links periodically
    const intervalId = setInterval(() => {
      console.log('SocialButtons: Periodic refresh');
      refreshSettings();
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [refreshSettings]);
  
  // Check if we have any social links to display
  const hasSocialLinks = settings?.whatsappUrl || settings?.instagramUrl || 
                        settings?.telegramUrl || settings?.twitterUrl;
  
  // Debug info to troubleshoot link display issues
  console.log('SocialButtons: Available links', {
    whatsapp: settings?.whatsappUrl,
    instagram: settings?.instagramUrl,
    telegram: settings?.telegramUrl,
    twitter: settings?.twitterUrl
  });
  
  if (!isLoaded) {
    // Wait for settings to load before rendering
    return null;
  }
  
  if (!hasSocialLinks) {
    console.log('SocialButtons: No social links available, not rendering');
    return null;
  }
  
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-50">
      {settings.whatsappUrl && <WhatsAppButton url={settings.whatsappUrl} />}
      {settings.instagramUrl && <InstagramButton url={settings.instagramUrl} />}
      {settings.telegramUrl && <TelegramButton url={settings.telegramUrl} />}
      {settings.twitterUrl && <TwitterButton url={settings.twitterUrl} />}
    </div>
  );
};
