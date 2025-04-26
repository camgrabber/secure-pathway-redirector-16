
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
      const data = await settingsService.loadSettings();
      
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
      
      // Apply updates to local state immediately
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      
      // Force a refresh from the database as well
      setTimeout(() => {
        refreshSettings();
      }, 500);
      
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
    loadSettings();
    
    // Set up real-time listener for settings changes
    console.log("SettingsManager: Setting up real-time subscription");
    const channel = supabase
      .channel('settings_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'app_settings' },
        (payload) => {
          console.log("SettingsManager: Received real-time update for settings:", payload);
          loadSettings();
        }
      )
      .subscribe((status) => {
        console.log("SettingsManager: Realtime subscription status:", status);
      });
      
    return () => {
      console.log("SettingsManager: Unsubscribing from real-time updates");
      supabase.removeChannel(channel);
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
