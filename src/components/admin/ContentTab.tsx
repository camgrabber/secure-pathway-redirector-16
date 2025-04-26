
import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';

export const ContentTab = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useSettingsManager();

  const handleSaveSettings = async (section: string) => {
    const formElement = document.getElementById(`${section}-form`) as HTMLFormElement;
    if (!formElement) return;
    
    const formData = new FormData(formElement);
    const updates: Record<string, string | number> = {};
    
    formData.forEach((value, key) => {
      updates[key] = value as string;
    });
    
    try {
      const result = await updateSettings(updates);
      
      if (result && result.success) {
        toast({
          title: 'Settings Saved',
          description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated`,
        });
      } else {
        throw new Error('Update returned no success indication');
      }
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: `There was a problem saving ${section} settings`,
        variant: 'destructive',
      });
      console.error(`Failed to save ${section} settings:`, error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Titles & Subtitles</CardTitle>
          <CardDescription>Customize the text displayed on each page</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="titles-form" className="grid gap-4">
            <div className="border-b pb-2">
              <h3 className="text-md font-semibold mb-2">Initial Page</h3>
              <div className="grid gap-2 mb-2">
                <Label htmlFor="initialTitle">Title</Label>
                <Input
                  id="initialTitle"
                  name="initialTitle"
                  defaultValue={settings.initialTitle}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="initialSubtitle">Subtitle</Label>
                <Input
                  id="initialSubtitle"
                  name="initialSubtitle"
                  defaultValue={settings.initialSubtitle}
                />
              </div>
            </div>
            
            <div className="border-b pb-2">
              <h3 className="text-md font-semibold mb-2">Security Check Page</h3>
              <div className="grid gap-2 mb-2">
                <Label htmlFor="securityTitle">Title</Label>
                <Input
                  id="securityTitle"
                  name="securityTitle"
                  defaultValue={settings.securityTitle}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="securitySubtitle">Subtitle</Label>
                <Input
                  id="securitySubtitle"
                  name="securitySubtitle"
                  defaultValue={settings.securitySubtitle}
                />
              </div>
            </div>
            
            <div className="pb-2">
              <h3 className="text-md font-semibold mb-2">Confirmation Page</h3>
              <div className="grid gap-2 mb-2">
                <Label htmlFor="confirmationTitle">Title</Label>
                <Input
                  id="confirmationTitle"
                  name="confirmationTitle"
                  defaultValue={settings.confirmationTitle}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmationSubtitle">Subtitle</Label>
                <Input
                  id="confirmationSubtitle"
                  name="confirmationSubtitle"
                  defaultValue={settings.confirmationSubtitle}
                />
              </div>
            </div>
            
            <Button type="button" onClick={() => handleSaveSettings('titles')} className="mt-2">
              <Save className="mr-2 h-4 w-4" />
              Save Content
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Button Text & Other Labels</CardTitle>
          <CardDescription>Customize button text and other UI elements</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="labels-form" className="grid gap-4">
            <div className="border-b pb-2">
              <h3 className="text-md font-semibold mb-2">Button Labels</h3>
              <div className="grid gap-2 mb-2">
                <Label htmlFor="initialButtonText">Initial Page Button</Label>
                <Input
                  id="initialButtonText"
                  name="initialButtonText"
                  defaultValue={settings.initialButtonText}
                />
              </div>
              <div className="grid gap-2 mb-2">
                <Label htmlFor="securityButtonText">Security Page Button</Label>
                <Input
                  id="securityButtonText"
                  name="securityButtonText"
                  defaultValue={settings.securityButtonText}
                />
              </div>
              <div className="grid gap-2 mb-2">
                <Label htmlFor="confirmationButtonText">Confirmation Page Button</Label>
                <Input
                  id="confirmationButtonText"
                  name="confirmationButtonText"
                  defaultValue={settings.confirmationButtonText}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="copyLinkButtonText">Copy Link Button</Label>
                <Input
                  id="copyLinkButtonText"
                  name="copyLinkButtonText"
                  defaultValue={settings.copyLinkButtonText}
                />
              </div>
            </div>
            
            <div className="pb-2">
              <h3 className="text-md font-semibold mb-2">Other Text</h3>
              <div className="grid gap-2 mb-2">
                <Label htmlFor="securityBadgeText">Security Badge Text</Label>
                <Input
                  id="securityBadgeText"
                  name="securityBadgeText"
                  defaultValue={settings.securityBadgeText}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  name="footerText"
                  defaultValue={settings.footerText}
                />
              </div>
            </div>
            
            <Button type="button" onClick={() => handleSaveSettings('labels')} className="mt-2">
              <Save className="mr-2 h-4 w-4" />
              Save Labels
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
