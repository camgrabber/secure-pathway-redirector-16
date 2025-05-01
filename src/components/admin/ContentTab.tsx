
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';
import { SocialLinksManager } from './SocialLinksManager';
import { PageTitlesForm } from './forms/PageTitlesForm';
import { ButtonLabelsForm } from './forms/ButtonLabelsForm';
import { LoadingScreenForm } from './forms/LoadingScreenForm';

export const ContentTab = () => {
  const { toast } = useToast();
  const { settings, updateSettings, refreshSettings } = useSettingsManager();

  useEffect(() => {
    console.log("ContentTab: Refreshing settings on mount");
    refreshSettings();
  }, [refreshSettings]);

  const handleSaveSettings = async (section: string) => {
    const formElement = document.getElementById(`${section}-form`) as HTMLFormElement;
    if (!formElement) return;
    
    const formData = new FormData(formElement);
    const updates: Record<string, string | number> = {};
    
    formData.forEach((value, key) => {
      updates[key] = value as string;
    });
    
    try {
      console.log(`ContentTab: Saving ${section} settings:`, updates);
      const result = await updateSettings(updates);
      
      if (result && result.success) {
        console.log(`ContentTab: ${section} settings saved successfully, refreshing`);
        await refreshSettings();
        
        toast({
          title: 'Settings Saved',
          description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated`,
        });
      } else {
        throw new Error('Update returned no success indication');
      }
    } catch (error) {
      console.error(`ContentTab: Failed to save ${section} settings:`, error);
      toast({
        title: 'Save Failed',
        description: `There was a problem saving ${section} settings`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PageTitlesForm settings={settings} onSave={handleSaveSettings} />
      <ButtonLabelsForm settings={settings} onSave={handleSaveSettings} />
      <LoadingScreenForm settings={settings} onSave={handleSaveSettings} />
      <SocialLinksManager />
    </div>
  );
};
