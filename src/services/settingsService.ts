
import { supabase } from '@/integrations/supabase/client';
import { AppSettings, SETTINGS_ID } from '@/types/settings';
import { defaultSettings } from '@/utils/defaultSettings';
import { Json } from '@/integrations/supabase/types';

export const settingsService = {
  async loadSettings() {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('id', SETTINGS_ID)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data?.setting_value) {
        return data.setting_value as unknown as AppSettings;
      }
      
      return null;
    } catch (e) {
      console.error('Failed to load settings:', e);
      return null;
    }
  },
  
  async initializeDefaultSettings() {
    try {
      const settingsAsJsonCompatible = { ...defaultSettings } as unknown as Json;
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: SETTINGS_ID,
          setting_value: settingsAsJsonCompatible
        });
        
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Error initializing default settings:', e);
      return false;
    }
  },
  
  async updateSettings(updates: Partial<AppSettings>) {
    try {
      const currentSettings = await this.loadSettings() || defaultSettings;
      const updatedSettings = { ...currentSettings, ...updates };
      const settingsAsJsonCompatible = { ...updatedSettings } as unknown as Json;
      
      const { error } = await supabase
        .from('app_settings')
        .update({ setting_value: settingsAsJsonCompatible })
        .eq('id', SETTINGS_ID);
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to update settings:', e);
      return false;
    }
  }
};
