
import { supabase } from '@/integrations/supabase/client';
import { AppSettings, SETTINGS_ID } from '@/types/settings';
import { defaultSettings } from '@/utils/defaultSettings';
import { Json } from '@/integrations/supabase/types';

export const settingsService = {
  async loadSettings() {
    try {
      console.log('SettingsService: Loading settings from database');
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('id', SETTINGS_ID)
        .maybeSingle();
      
      if (error) {
        console.error('SettingsService: Error loading settings:', error);
        throw error;
      }
      
      if (data?.setting_value) {
        console.log('SettingsService: Settings loaded successfully');
        return data.setting_value as unknown as AppSettings;
      }
      
      console.log('SettingsService: No settings found');
      return null;
    } catch (e) {
      console.error('SettingsService: Failed to load settings:', e);
      return null;
    }
  },
  
  async initializeDefaultSettings() {
    try {
      console.log('SettingsService: Initializing default settings');
      const settingsAsJsonCompatible = { ...defaultSettings } as unknown as Json;
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: SETTINGS_ID,
          setting_value: settingsAsJsonCompatible
        }, { onConflict: 'id' });
        
      if (error) {
        console.error('SettingsService: Error initializing default settings:', error);
        throw error;
      }
      
      console.log('SettingsService: Default settings initialized successfully');
      return true;
    } catch (e) {
      console.error('SettingsService: Error initializing default settings:', e);
      return false;
    }
  },
  
  async updateSettings(updates: Partial<AppSettings>) {
    try {
      console.log('SettingsService: Updating settings with:', updates);
      
      // Direct update without fetching first (more reliable)
      const { error, data } = await supabase.rpc('update_app_settings', {
        settings_id: SETTINGS_ID,
        settings_updates: updates as Json
      });
      
      if (error) {
        console.error('SettingsService: Failed to update settings via RPC:', error);
        
        // Fallback to the traditional method
        const currentSettings = await this.loadSettings() || defaultSettings;
        const updatedSettings = { ...currentSettings, ...updates };
        const settingsAsJsonCompatible = { ...updatedSettings } as unknown as Json;
        
        const { error: fallbackError } = await supabase
          .from('app_settings')
          .update({ 
            setting_value: settingsAsJsonCompatible,
            updated_at: new Date().toISOString()
          })
          .eq('id', SETTINGS_ID);
        
        if (fallbackError) {
          console.error('SettingsService: Fallback update also failed:', fallbackError);
          throw fallbackError;
        }
      }
      
      console.log('SettingsService: Settings updated successfully');
      return true;
    } catch (e) {
      console.error('SettingsService: Failed to update settings:', e);
      return false;
    }
  },
  
  // New method to ensure we get fresh data
  async forceRefreshSettings() {
    try {
      console.log('SettingsService: Force refreshing settings from database');
      
      // Clear any potential cache with nocache parameter
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('id', SETTINGS_ID)
        .options({ count: 'exact' })
        .maybeSingle();
      
      if (error) {
        console.error('SettingsService: Error force refreshing settings:', error);
        throw error;
      }
      
      if (data?.setting_value) {
        console.log('SettingsService: Settings force refreshed successfully');
        return data.setting_value as unknown as AppSettings;
      }
      
      console.log('SettingsService: No settings found during force refresh');
      return null;
    } catch (e) {
      console.error('SettingsService: Failed to force refresh settings:', e);
      return null;
    }
  }
};
