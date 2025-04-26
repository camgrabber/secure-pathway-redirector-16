
import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  active: boolean;
}

export const SocialLinksManager = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('platform');

      if (error) throw error;
      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error loading social links:', error);
      toast({
        title: 'Error',
        description: 'Failed to load social media links',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('social_links')
        .upsert(socialLinks);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Social media links have been updated',
      });
      
      await loadSocialLinks();
    } catch (error) {
      console.error('Error saving social links:', error);
      toast({
        title: 'Error',
        description: 'Failed to save social media links',
        variant: 'destructive',
      });
    }
  };

  const updateSocialLink = (platform: string, url: string) => {
    setSocialLinks(prev => 
      prev.map(link => 
        link.platform === platform ? { ...link, url } : link
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>Configure your social media button links</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          {socialLinks.map((link) => (
            <div key={link.platform} className="grid gap-2">
              <Label htmlFor={link.platform}>{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)} Link</Label>
              <Input
                id={link.platform}
                value={link.url}
                onChange={(e) => updateSocialLink(link.platform, e.target.value)}
                placeholder={`https://${link.platform}.com/yourusername`}
              />
            </div>
          ))}
          
          <Button type="button" onClick={handleSave} className="mt-2">
            <Save className="mr-2 h-4 w-4" />
            Save Social Links
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
