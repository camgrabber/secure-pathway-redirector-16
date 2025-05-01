
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppSettings, SETTINGS_ID } from '@/types/settings';
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
    return { success: true };
  }, [loadSettings]);
  
  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      console.log("SettingsManager: Updating settings with:", updates);
      
      // Log the current settings
      console.log("SettingsManager: Current settings before update:", settings);
      
      const success = await settingsService.updateSettings(updates);
      if (!success) throw new Error('Update failed');
      
      // Apply updates to local state immediately for UI responsiveness
      setSettings(prevSettings => ({ ...prevSettings, ...updates }));
      
      // Log the updated settings
      console.log("SettingsManager: Applied updates to state:", updates);
      console.log("SettingsManager: New settings state:", { ...settings, ...updates });
      
      // Force refresh after update to ensure consistency
      await refreshSettings();
      
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
      await refreshSettings();
      
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
  
  useEffect(() => {
    console.log("SettingsManager: Initial setup");
    loadSettings();
    
    // Set up real-time subscription with improved configuration
    console.log("SettingsManager: Setting up real-time subscription");
    const channel = supabase
      .channel('settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload) => {
          console.log("SettingsManager: Received real-time update:", payload);
          loadSettings();
        }
      )
      .subscribe((status) => {
        console.log("SettingsManager: Realtime subscription status:", status);
      });
      
    // Set up a periodic refresh as a failsafe
    const intervalId = setInterval(() => {
      console.log("SettingsManager: Performing periodic refresh");
      loadSettings();
    }, 15000); // Every 15 seconds
      
    return () => {
      console.log("SettingsManager: Cleaning up");
      supabase.removeChannel(channel);
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
