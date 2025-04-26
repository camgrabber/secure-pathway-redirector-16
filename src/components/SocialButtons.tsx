
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSocialLinks();
    
    // Set up real-time subscription for social links changes
    const channel = supabase
      .channel('social-links-changes')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public', 
          table: 'social_links' 
        },
        () => {
          console.log('Social links changed, reloading data');
          loadSocialLinks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSocialLinks = async () => {
    try {
      setIsLoading(true);
      console.log('Loading social links...');
      
      const { data, error } = await supabase
        .from('social_links')
        .select('platform, url, active')
        .eq('active', true);

      if (error) {
        console.error('Error loading social links:', error);
        throw error;
      }
      
      if (data) {
        console.log('Loaded social links:', data);
        const links = data.reduce((acc, link) => ({
          ...acc,
          [link.platform]: link.url
        }), {});
        setSocialLinks(links);
      }
    } catch (error) {
      console.error('Error loading social links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 items-center">
      {socialLinks.whatsapp && <WhatsAppButton url={socialLinks.whatsapp} />}
      {socialLinks.instagram && <InstagramButton url={socialLinks.instagram} />}
      {socialLinks.twitter && <TwitterButton url={socialLinks.twitter} />}
      {socialLinks.telegram && <TelegramButton url={socialLinks.telegram} />}
    </div>
  );
};
