
import { useSettingsManager } from '@/utils/settingsManager';
import { WhatsAppButton } from './social/WhatsAppButton';
import { InstagramButton } from './social/InstagramButton';
import { TwitterButton } from './social/TwitterButton';
import { TelegramButton } from './social/TelegramButton';

export const SocialButtons = () => {
  const { settings } = useSettingsManager();

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 items-center">
      <WhatsAppButton url={settings.whatsappUrl} />
      <InstagramButton url={settings.instagramUrl} />
      <TwitterButton url={settings.twitterUrl} />
      <TelegramButton url={settings.telegramUrl} />
    </div>
  );
};
