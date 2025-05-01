
import { supabase } from '@/integrations/supabase/client';

interface AppSettings {
  [key: string]: string | number | boolean;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  active: boolean;
}

export class SettingsService {
  // Get all settings
  static async getSettings(): Promise<AppSettings | null> {
    try {
      // Add cache-busting parameter to avoid stale data
      const timestamp = Date.now();
      console.log('SettingsService: Force refreshing settings from database');
      console.log('SettingsService: Adding cache-busting timestamp', timestamp);
      
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 'app_settings')
        .maybeSingle();
      
      if (error) {
        console.error("SettingsService: Error fetching settings:", error.message);
        throw error;
      }
      
      if (data) {
        const { id, created_at, updated_at, ...settings } = data;
        console.log("SettingsService: Settings force refreshed successfully", updated_at);
        return settings;
      }
      
      return null;
    } catch (error) {
      console.error("SettingsService: Failed to get settings:", error);
      throw error;
    }
  }
  
  // Update settings
  static async updateSettings(updates: Partial<AppSettings>): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'app_settings');
      
      if (error) {
        console.error("SettingsService: Error updating settings:", error.message);
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error("SettingsService: Failed to update settings:", error);
      return { success: false };
    }
  }
  
  // Get social media links
  static async getSocialLinks(): Promise<SocialLink[] | null> {
    try {
      // Add cache-busting parameter
      const timestamp = Date.now();
      
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('platform');
      
      if (error) {
        console.error("SettingsService: Error fetching social links:", error.message);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("SettingsService: Failed to get social links:", error);
      throw error;
    }
  }
  
  // Helper method to force settings refresh
  static async forceRefreshSettings(): Promise<void> {
    try {
      await this.getSettings();
    } catch (error) {
      console.error("SettingsService: Failed to force refresh settings:", error);
      throw error;
    }
  }
}
