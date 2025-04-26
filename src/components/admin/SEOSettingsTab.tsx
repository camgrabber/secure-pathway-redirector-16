import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SEOSettings {
  id: string;
  page_path: string;
  title: string;
  description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image_url: string | null;
  canonical_url: string | null;
  robots_content: string | null;
}

const SEOSettingsTab = () => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_path');

      if (error) throw error;
      setSeoSettings(data || []);
    } catch (error) {
      console.error('Error loading SEO settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load SEO settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string, formData: FormData) => {
    try {
      const updates: Partial<SEOSettings> = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        keywords: formData.get('keywords') as string,
        og_title: formData.get('og_title') as string,
        og_description: formData.get('og_description') as string,
        og_image_url: formData.get('og_image_url') as string,
        twitter_card: formData.get('twitter_card') as string,
        twitter_title: formData.get('twitter_title') as string,
        twitter_description: formData.get('twitter_description') as string,
        twitter_image_url: formData.get('twitter_image_url') as string,
        canonical_url: formData.get('canonical_url') as string,
        robots_content: formData.get('robots_content') as string,
      };

      const { error } = await supabase
        .from('seo_settings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'SEO settings updated successfully',
      });

      setEditingId(null);
      loadSEOSettings();
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update SEO settings',
        variant: 'destructive',
      });
    }
  };

  const handleAddNewPage = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .insert([{
          page_path: '/new-page',
          title: 'New Page Title',
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'New page SEO settings created',
      });

      loadSEOSettings();
      setEditingId(data.id);
    } catch (error) {
      console.error('Error creating new SEO settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new SEO settings',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading SEO settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">SEO Settings</h2>
        <Button onClick={handleAddNewPage}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Page
        </Button>
      </div>

      {seoSettings.map((setting) => (
        <Card key={setting.id}>
          <CardHeader>
            <CardTitle>{setting.page_path}</CardTitle>
            <CardDescription>
              Last updated: {new Date().toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingId === setting.id ? (
              <form
                id={`seo-form-${setting.id}`}
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSave(setting.id, formData);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor={`page_path-${setting.id}`}>Page Path</Label>
                  <Input
                    id={`page_path-${setting.id}`}
                    name="page_path"
                    defaultValue={setting.page_path}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`title-${setting.id}`}>Title</Label>
                  <Input
                    id={`title-${setting.id}`}
                    name="title"
                    defaultValue={setting.title}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${setting.id}`}>Description</Label>
                  <Textarea
                    id={`description-${setting.id}`}
                    name="description"
                    defaultValue={setting.description || ''}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`keywords-${setting.id}`}>Keywords</Label>
                  <Input
                    id={`keywords-${setting.id}`}
                    name="keywords"
                    defaultValue={setting.keywords || ''}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Open Graph</h3>
                    <div className="space-y-2">
                      <Label htmlFor={`og_title-${setting.id}`}>OG Title</Label>
                      <Input
                        id={`og_title-${setting.id}`}
                        name="og_title"
                        defaultValue={setting.og_title || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`og_description-${setting.id}`}>OG Description</Label>
                      <Textarea
                        id={`og_description-${setting.id}`}
                        name="og_description"
                        defaultValue={setting.og_description || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`og_image_url-${setting.id}`}>OG Image URL</Label>
                      <Input
                        id={`og_image_url-${setting.id}`}
                        name="og_image_url"
                        defaultValue={setting.og_image_url || ''}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Twitter Card</h3>
                    <div className="space-y-2">
                      <Label htmlFor={`twitter_card-${setting.id}`}>Card Type</Label>
                      <Input
                        id={`twitter_card-${setting.id}`}
                        name="twitter_card"
                        defaultValue={setting.twitter_card || 'summary_large_image'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`twitter_title-${setting.id}`}>Twitter Title</Label>
                      <Input
                        id={`twitter_title-${setting.id}`}
                        name="twitter_title"
                        defaultValue={setting.twitter_title || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`twitter_description-${setting.id}`}>Twitter Description</Label>
                      <Textarea
                        id={`twitter_description-${setting.id}`}
                        name="twitter_description"
                        defaultValue={setting.twitter_description || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`twitter_image_url-${setting.id}`}>Twitter Image URL</Label>
                      <Input
                        id={`twitter_image_url-${setting.id}`}
                        name="twitter_image_url"
                        defaultValue={setting.twitter_image_url || ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`canonical_url-${setting.id}`}>Canonical URL</Label>
                  <Input
                    id={`canonical_url-${setting.id}`}
                    name="canonical_url"
                    defaultValue={setting.canonical_url || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`robots_content-${setting.id}`}>Robots Content</Label>
                  <Input
                    id={`robots_content-${setting.id}`}
                    name="robots_content"
                    defaultValue={setting.robots_content || 'index, follow'}
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Title</h4>
                    <p className="text-sm text-gray-600">{setting.title}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                </div>
                <Button onClick={() => setEditingId(setting.id)}>
                  Edit Settings
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SEOSettingsTab;
