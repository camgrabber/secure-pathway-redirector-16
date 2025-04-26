
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
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('platform, url, active')
        .eq('active', true);

      if (error) throw error;
      
      if (data) {
        const links = data.reduce((acc, link) => ({
          ...acc,
          [link.platform]: link.url
        }), {});
        setSocialLinks(links);
      }
    } catch (error) {
      console.error('Error loading social links:', error);
    }
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 items-center">
      {socialLinks.whatsapp && <WhatsAppButton url={socialLinks.whatsapp} />}
      {socialLinks.instagram && <InstagramButton url={socialLinks.instagram} />}
      {socialLinks.twitter && <TwitterButton url={socialLinks.twitter} />}
      {socialLinks.telegram && <TelegramButton url={socialLinks.telegram} />}
    </div>
  );
};
