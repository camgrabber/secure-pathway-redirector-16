
import React, { useEffect, useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { useSettingsManager } from '@/utils/settingsManager';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  active: boolean;
}

export const SocialLinksManager = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
  const { refreshSettings, updateSettings, settings } = useSettingsManager();

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      setLoading(true);
      console.log('SocialLinksManager: Loading social links');
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('platform');

      if (error) throw error;
      console.log('SocialLinksManager: Loaded social links:', data);
      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error loading social links:', error);
      toast({
        title: 'Error',
        description: 'Failed to load social media links',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveSuccess(false);
      console.log('SocialLinksManager: Saving links:', socialLinks);
      
      // Update each link individually
      for (const link of socialLinks) {
        console.log(`SocialLinksManager: Updating ${link.platform}, active: ${link.active}, url: ${link.url}`);
        
        // Only save if the URL is not empty when active is true
        if (link.active && !link.url) {
          toast({
            title: 'Validation Error',
            description: `${link.platform} is active but has no URL. Please add a URL or disable it.`,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        const { error } = await supabase
          .from('social_links')
          .update({
            url: link.url || '',
            active: link.active,
            updated_at: new Date().toISOString()
          })
          .eq('id', link.id);
          
        if (error) {
          console.error(`Error updating ${link.platform}:`, error);
          throw error;
        }
        
        // Update the main settings with the social link values
        if (link.platform === 'whatsapp') {
          await updateSettings({ whatsappUrl: link.active ? link.url : '' });
        } else if (link.platform === 'instagram') {
          await updateSettings({ instagramUrl: link.active ? link.url : '' });
        } else if (link.platform === 'twitter') {
          await updateSettings({ twitterUrl: link.active ? link.url : '' });
        } else if (link.platform === 'telegram') {
          await updateSettings({ telegramUrl: link.active ? link.url : '' });
        }
      }

      toast({
        title: 'Success',
        description: 'Social media links have been updated',
      });
      
      // Refresh settings in the app context to update UI immediately
      await refreshSettings();
      
      // Show success indicator
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Refresh the links after save
      await loadSocialLinks();
    } catch (error) {
      console.error('Error saving social links:', error);
      toast({
        title: 'Error',
        description: 'Failed to save social media links',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string | boolean) => {
    setSocialLinks(prev => 
      prev.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const handleForceRefresh = async () => {
    try {
      setLoading(true);
      // First reload links from database
      await loadSocialLinks();
      
      // Then refresh the settings context
      await refreshSettings();
      
      toast({
        title: 'Refreshed',
        description: 'Social media links have been refreshed',
      });
    } catch (error) {
      console.error('Error refreshing social links:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Failed to refresh social media links',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Configure your social media button links</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleForceRefresh} 
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {socialLinks.map((link) => (
            <div key={link.id} className="grid gap-2 pb-4 border-b last:border-0">
              <div className="flex justify-between items-center">
                <Label htmlFor={`${link.platform}-url`} className="capitalize text-base font-medium">
                  {link.platform}
                </Label>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`${link.platform}-active`} className="mr-2">Active</Label>
                  <Switch 
                    id={`${link.platform}-active`}
                    checked={link.active} 
                    onCheckedChange={(checked) => updateSocialLink(link.id, 'active', checked)} 
                  />
                </div>
              </div>
              
              <Input
                id={`${link.platform}-url`}
                value={link.url || ''}
                onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                placeholder={`https://${link.platform}.com/yourusername`}
                disabled={!link.active}
                className={!link.active ? "bg-gray-100" : ""}
              />
              <p className="text-xs text-gray-500">
                {link.active 
                  ? `Enter the full URL including https://` 
                  : `Enable the switch above to set a ${link.platform} URL`}
              </p>
            </div>
          ))}
          
          <Button 
            type="submit" 
            disabled={loading} 
            className="mt-2"
            variant={saveSuccess ? "outline" : "default"}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <span className="h-4 w-4 mr-2 text-green-500">✓</span>
                Saved!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Social Links
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-2">
            Changes will appear immediately on your website.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
