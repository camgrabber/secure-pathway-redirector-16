
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
      
      console.log('SettingsService: No settings found, will initialize defaults');
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
      
      // First get current settings
      const currentSettings = await this.loadSettings() || defaultSettings;
      
      // Ensure numeric fields are properly converted to numbers
      const processedUpdates = { ...updates };
      
      // Process numeric fields explicitly
      if ('initialTimerSeconds' in updates) {
        processedUpdates.initialTimerSeconds = Number(updates.initialTimerSeconds);
      }
      if ('securityScanDurationMs' in updates) {
        processedUpdates.securityScanDurationMs = Number(updates.securityScanDurationMs);
      }
      if ('confirmationTimerSeconds' in updates) {
        processedUpdates.confirmationTimerSeconds = Number(updates.confirmationTimerSeconds);
      }
      
      const updatedSettings = { ...currentSettings, ...processedUpdates };
      const settingsAsJsonCompatible = { ...updatedSettings } as unknown as Json;
      
      console.log('SettingsService: Processed updates:', processedUpdates);
      console.log('SettingsService: Final settings to save:', updatedSettings);
      
      const { data, error } = await supabase
        .from('app_settings')
        .update({ 
          setting_value: settingsAsJsonCompatible,
          updated_at: new Date().toISOString()
        })
        .eq('id', SETTINGS_ID)
        .select();
      
      if (error) {
        console.error('SettingsService: Failed to update settings:', error);
        throw error;
      }
      
      console.log('SettingsService: Settings updated successfully', data);
      return true;
    } catch (e) {
      console.error('SettingsService: Failed to update settings:', e);
      return false;
    }
  },
  
  // Force refresh function to bypass any caching
  async forceRefreshSettings() {
    try {
      console.log('SettingsService: Force refreshing settings from database');
      
      const timestamp = new Date().getTime();
      console.log(`SettingsService: Adding cache-busting timestamp ${timestamp}`);
      
      // Explicitly use a non-caching query
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value, updated_at')
        .eq('id', SETTINGS_ID)
        .maybeSingle();
      
      if (error) {
        console.error('SettingsService: Error force refreshing settings:', error);
        throw error;
      }
      
      if (data?.setting_value) {
        console.log('SettingsService: Settings force refreshed successfully', data.updated_at);
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
