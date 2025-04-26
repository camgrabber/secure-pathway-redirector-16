
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppSettings {
  // Admin credentials
  adminUsername: string;
  adminPassword: string;
  
  // Page titles & subtitles
  initialTitle: string;
  initialSubtitle: string;
  securityTitle: string;
  securitySubtitle: string;
  confirmationTitle: string;
  confirmationSubtitle: string;
  
  // Timer settings
  initialTimerSeconds: number;
  securityScanDurationMs: number;
  confirmationTimerSeconds: number;
  
  // Button text
  initialButtonText: string;
  securityButtonText: string;
  confirmationButtonText: string;
  copyLinkButtonText: string;
  
  // Security badge text
  securityBadgeText: string;
  
  // Footer text
  footerText: string;
  
  // Default destination
  defaultDestinationUrl: string;
}

const SETTINGS_ID = 'app_settings';

export const useSettingsManager = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load settings from Supabase on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('setting_value')
          .eq('id', SETTINGS_ID)
          .single();
        
        if (error) throw error;
        
        // Properly type assert the JSON data to our AppSettings type
        const settingsData = data.setting_value as unknown as AppSettings;
        
        // Validate that required fields exist
        if (!settingsData || typeof settingsData !== 'object') {
          throw new Error('Invalid settings data format');
        }
        
        setSettings(settingsData);
      } catch (e) {
        console.error('Failed to load settings:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadSettings();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload) => {
          loadSettings(); // Reload settings when changes occur
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, []);
  
  // Update settings in Supabase
  const updateSettings = async (updates: Partial<AppSettings>) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings, ...updates };
    
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ setting_value: updatedSettings })
        .eq('id', SETTINGS_ID);
      
      if (error) throw error;
      setSettings(updatedSettings);
    } catch (e) {
      console.error('Failed to update settings:', e);
      throw e;
    }
  };
  
  // Reset settings to defaults
  const resetToDefaults = async () => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({
          setting_value: {
            adminUsername: "admin",
            adminPassword: "admin123",
            initialTitle: "Wait For Secure Link",
            initialSubtitle: "Your secure link is just moments away",
            securityTitle: "Security Verification",
            securitySubtitle: "We're checking this link for your safety",
            confirmationTitle: "Ready to Proceed",
            confirmationSubtitle: "Your link is ready for access",
            initialTimerSeconds: 10,
            securityScanDurationMs: 8000,
            confirmationTimerSeconds: 5,
            initialButtonText: "Continue to Security Check",
            securityButtonText: "Proceed to Final Step",
            confirmationButtonText: "Proceed to Destination",
            copyLinkButtonText: "Copy Link",
            securityBadgeText: "100% Secure Redirection Service",
            footerText: `© ${new Date().getFullYear()} Secure Pathway Redirector. All rights reserved.`,
            defaultDestinationUrl: "https://example.com"
          }
        })
        .eq('id', SETTINGS_ID);
      
      if (error) throw error;
    } catch (e) {
      console.error('Failed to reset settings:', e);
      throw e;
    }
  };
  
  // Verify admin credentials
  const verifyAdminCredentials = (username: string, password: string): boolean => {
    if (!settings) return false;
    return username === settings.adminUsername && password === settings.adminPassword;
  };
  
  return {
    settings: settings || {} as AppSettings, // Provide empty object as fallback
    isLoaded,
    updateSettings,
    resetToDefaults,
    verifyAdminCredentials
  };
};
