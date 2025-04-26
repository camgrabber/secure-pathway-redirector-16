import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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

// Default settings as fallback
const defaultSettings: AppSettings = {
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
};

export const useSettingsManager = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Function to load settings from Supabase
  const loadSettings = useCallback(async () => {
    try {
      console.log("Loading app settings from Supabase...");
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('id', SETTINGS_ID)
        .maybeSingle();
      
      if (error) {
        console.error("Failed to load settings:", error);
        // Use default settings on error
        console.log("Using default settings as fallback");
        setSettings(defaultSettings);
      } else if (data && data.setting_value) {
        // Properly type assert the JSON data to our AppSettings type
        try {
          const settingsData = data.setting_value as unknown as AppSettings;
          
          // Validate that required fields exist
          if (!settingsData || typeof settingsData !== 'object') {
            console.error("Invalid settings data format");
            // Use default settings on invalid format
            setSettings(defaultSettings);
          } else {
            console.log("Settings loaded successfully:", settingsData);
            setSettings(settingsData);
          }
        } catch (parseError) {
          console.error("Failed to parse settings:", parseError);
          setSettings(defaultSettings);
        }
      } else {
        console.log("No settings found, using defaults");
        setSettings(defaultSettings);
        
        // Try to initialize settings since they don't exist
        await initializeDefaultSettings();
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
      // Ensure we always have settings by using defaults if needed
      setSettings(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  }, []);
  
  // Helper function to initialize default settings in the database
  const initializeDefaultSettings = async () => {
    try {
      console.log("Initializing default settings in database");
      // TypeScript fix: Convert to Json type correctly
      const settingsAsJsonCompatible = { ...defaultSettings } as unknown as Json;
      
      const { error } = await supabase
        .from('app_settings')
        .insert({
          id: SETTINGS_ID,
          setting_value: settingsAsJsonCompatible
        });
          
      if (error) {
        console.error("Failed to initialize default settings:", error);
        
        // Try upsert if insert fails
        const { error: upsertError } = await supabase
          .from('app_settings')
          .upsert({
            id: SETTINGS_ID,
            setting_value: settingsAsJsonCompatible
          });
            
        if (upsertError) {
          console.error("Failed to upsert default settings:", upsertError);
        }
      } else {
        console.log("Successfully initialized default settings");
      }
    } catch (e) {
      console.error("Error initializing default settings:", e);
    }
  };
  
  // Load settings on mount
  useEffect(() => {
    loadSettings();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload) => {
          console.log("Received real-time update for settings:", payload);
          loadSettings(); // Reload settings when changes occur
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [loadSettings]);
  
  // Public function to refresh settings manually
  const refreshSettings = useCallback(async () => {
    console.log("Manually refreshing settings from database");
    return loadSettings();
  }, [loadSettings]);
  
  // Update settings in Supabase
  const updateSettings = async (updates: Partial<AppSettings>) => {
    if (!settings) return;
    
    console.log("Updating settings with:", updates);
    const updatedSettings = { ...settings, ...updates };
    
    try {
      // TypeScript fix: Convert AppSettings to a plain object that's compatible with Json type
      const settingsAsJsonCompatible = { ...updatedSettings } as unknown as Json;
      
      const { error } = await supabase
        .from('app_settings')
        .update({ setting_value: settingsAsJsonCompatible })
        .eq('id', SETTINGS_ID);
      
      if (error) {
        console.error("Error updating settings in Supabase:", error);
        throw error;
      }
      
      setSettings(updatedSettings);
      console.log("Settings updated successfully:", updatedSettings);
      return { success: true };
    } catch (e) {
      console.error('Failed to update settings:', e);
      throw e;
    }
  };
  
  // Reset settings to defaults
  const resetToDefaults = async () => {
    try {
      // TypeScript fix: Convert defaultSettings to a plain object that's compatible with Json type
      const defaultsAsJsonCompatible = { ...defaultSettings } as unknown as Json;
      
      const { error } = await supabase
        .from('app_settings')
        .update({
          setting_value: defaultsAsJsonCompatible
        })
        .eq('id', SETTINGS_ID);
      
      if (error) throw error;
      setSettings(defaultSettings);
      console.log("Settings reset to defaults");
      return { success: true };
    } catch (e) {
      console.error('Failed to reset settings:', e);
      throw e;
    }
  };
  
  // Verify admin credentials - allow login with default credentials
  const verifyAdminCredentials = (username: string, password: string): boolean => {
    // Direct comparison with hardcoded default credentials to ensure admin access
    if (username === "admin" && password === "admin123") {
      console.log("Login successful with default admin credentials");
      return true;
    }
    
    // If settings aren't loaded yet, use default credentials
    const settingsToUse = settings || defaultSettings;
    
    console.log("Verifying credentials against stored settings");
    console.log("Checking username:", username, "vs", settingsToUse.adminUsername);
    console.log("Checking password:", password.length > 0 ? "[provided]" : "[not provided]", 
                "vs", settingsToUse.adminPassword ? "[stored]" : "[not stored]");
    
    const isValid = username === settingsToUse.adminUsername && password === settingsToUse.adminPassword;
    console.log("Credentials valid:", isValid);
    
    return isValid;
  };
  
  return {
    settings,
    isLoaded,
    updateSettings,
    resetToDefaults,
    verifyAdminCredentials,
    refreshSettings // Expose the refreshSettings function
  };
};
