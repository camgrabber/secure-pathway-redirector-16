
import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  active: boolean;
}

export const SocialLinksManager = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update each link individually instead of using bulk upsert
      for (const link of socialLinks) {
        const { error } = await supabase
          .from('social_links')
          .update({
            url: link.url,
            active: link.active,
            updated_at: new Date().toISOString()
          })
          .eq('id', link.id);
          
        if (error) {
          console.error('Error updating link:', link.platform, error);
          throw error;
        }
      }

      toast({
        title: 'Success',
        description: 'Social media links have been updated',
      });
      
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>Configure your social media button links</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {socialLinks.map((link) => (
            <div key={link.id} className="grid gap-2 pb-4 border-b last:border-0">
              <div className="flex justify-between items-center">
                <Label htmlFor={`${link.platform}-url`} className="capitalize text-base font-medium">
                  {link.platform}
                </Label>
                
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={link.active} 
                      onCheckedChange={(checked) => updateSocialLink(link.id, 'active', checked)} 
                    />
                  </FormControl>
                </FormItem>
              </div>
              
              <Input
                id={`${link.platform}-url`}
                value={link.url || ''}
                onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                placeholder={`https://${link.platform}.com/yourusername`}
              />
            </div>
          ))}
          
          <Button type="submit" disabled={loading} className="mt-2">
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Social Links'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
