
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppButton } from './social/WhatsAppButton';
import { InstagramButton } from './social/InstagramButton';
import { TwitterButton } from './social/TwitterButton';
import { TelegramButton } from './social/TelegramButton';

interface SocialLink {
  platform: string;
  url: string;
  active: boolean;
}

export const SocialButtons = () => {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    const { data } = await supabase
      .from('social_links')
      .select('platform, url')
      .eq('active', true);

    if (data) {
      const links = data.reduce((acc, link) => ({
        ...acc,
        [link.platform]: link.url
      }), {});
      setSocialLinks(links);
    }
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 items-center">
      <WhatsAppButton url={socialLinks.whatsapp} />
      <InstagramButton url={socialLinks.instagram} />
      <TwitterButton url={socialLinks.twitter} />
      <TelegramButton url={socialLinks.telegram} />
    </div>
  );
};
