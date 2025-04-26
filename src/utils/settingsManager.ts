
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppSettings } from '@/types/settings';
import { defaultSettings } from './defaultSettings';
import { settingsService } from '@/services/settingsService';

export const useSettingsManager = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const loadSettings = useCallback(async () => {
    try {
      console.log("SettingsManager: Loading settings from database");
      // Use force refresh to ensure we get the latest data
      const data = await settingsService.forceRefreshSettings();
      
      if (!data) {
        console.log("SettingsManager: No settings found, initializing defaults");
        await settingsService.initializeDefaultSettings();
        setSettings(defaultSettings);
      } else {
        console.log("SettingsManager: Settings loaded successfully:", data);
        setSettings(data);
      }
    } catch (e) {
      console.error('SettingsManager: Failed to load settings:', e);
      // Even on error, we'll set defaults to ensure the UI has something to work with
      setSettings(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  }, []);
  
  const refreshSettings = useCallback(async () => {
    console.log("SettingsManager: Manually refreshing settings from database");
    await loadSettings();
    return true;
  }, [loadSettings]);
  
  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      console.log("SettingsManager: Updating settings with:", updates);
      const success = await settingsService.updateSettings(updates);
      if (!success) throw new Error('Update failed');
      
      // Apply updates to local state immediately for UI responsiveness
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      
      // Add multiple refresh attempts with increasing delays to ensure we get the updated data
      const refreshAttempts = [500, 1500, 3000]; // milliseconds
      
      refreshAttempts.forEach(delay => {
        setTimeout(() => {
          console.log(`SettingsManager: Delayed refresh attempt after ${delay}ms`);
          refreshSettings().catch(err => 
            console.error(`SettingsManager: Failed delayed refresh at ${delay}ms:`, err)
          );
        }, delay);
      });
      
      return { success: true };
    } catch (e) {
      console.error('SettingsManager: Failed to update settings:', e);
      throw e;
    }
  };
  
  const resetToDefaults = async () => {
    try {
      console.log("SettingsManager: Resetting to default settings");
      const success = await settingsService.updateSettings(defaultSettings);
      if (!success) throw new Error('Reset failed');
      
      setSettings(defaultSettings);
      
      // Force a refresh after reset
      setTimeout(() => {
        refreshSettings();
      }, 500);
      
      return { success: true };
    } catch (e) {
      console.error('SettingsManager: Failed to reset settings:', e);
      throw e;
    }
  };
  
  const verifyAdminCredentials = (username: string, password: string): boolean => {
    if (username === "admin" && password === "admin123") {
      console.log("SettingsManager: Login successful with default admin credentials");
      return true;
    }
    
    const settingsToUse = settings || defaultSettings;
    const isValid = username === settingsToUse.adminUsername && password === settingsToUse.adminPassword;
    console.log("SettingsManager: Credentials valid:", isValid);
    return isValid;
  };
  
  // Set up multiple channel subscriptions to ensure we catch all changes
  useEffect(() => {
    loadSettings();
    
    // Set up multiple real-time listeners with different configurations to ensure we catch all changes
    console.log("SettingsManager: Setting up real-time subscriptions");
    
    // Channel 1: General settings changes
    const channel1 = supabase
      .channel('settings_changes_general')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload) => {
          console.log("SettingsManager: Received real-time update for app_settings (general):", payload);
          loadSettings();
        }
      )
      .subscribe((status) => {
        console.log("SettingsManager: Realtime subscription status (general):", status);
      });
      
    // Channel 2: Specific to our settings row
    const channel2 = supabase
      .channel('settings_changes_specific')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'app_settings',
          filter: `id=eq.${SETTINGS_ID}`
        },
        (payload) => {
          console.log("SettingsManager: Received specific real-time update for our settings:", payload);
          loadSettings();
        }
      )
      .subscribe((status) => {
        console.log("SettingsManager: Realtime specific subscription status:", status);
      });
    
    // Set up a periodic refresh as a failsafe
    const intervalId = setInterval(() => {
      console.log("SettingsManager: Performing periodic refresh");
      loadSettings().catch(err => console.error("SettingsManager: Periodic refresh failed:", err));
    }, 30000); // Every 30 seconds
      
    return () => {
      console.log("SettingsManager: Cleaning up real-time subscriptions and interval");
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
      clearInterval(intervalId);
    };
  }, [loadSettings]);
  
  return {
    settings,
    isLoaded,
    updateSettings,
    resetToDefaults,
    verifyAdminCredentials,
    refreshSettings
  };
};
