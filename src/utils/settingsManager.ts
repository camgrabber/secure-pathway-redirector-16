
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
      const data = await settingsService.loadSettings();
      
      if (!data) {
        console.log("No settings found, initializing defaults");
        await settingsService.initializeDefaultSettings();
        setSettings(defaultSettings);
      } else {
        console.log("Settings loaded successfully:", data);
        setSettings(data);
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
      setSettings(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  }, []);
  
  const refreshSettings = useCallback(async () => {
    console.log("Manually refreshing settings from database");
    return loadSettings();
  }, [loadSettings]);
  
  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      const success = await settingsService.updateSettings(updates);
      if (!success) throw new Error('Update failed');
      
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      return { success: true };
    } catch (e) {
      console.error('Failed to update settings:', e);
      throw e;
    }
  };
  
  const resetToDefaults = async () => {
    try {
      const success = await settingsService.updateSettings(defaultSettings);
      if (!success) throw new Error('Reset failed');
      
      setSettings(defaultSettings);
      return { success: true };
    } catch (e) {
      console.error('Failed to reset settings:', e);
      throw e;
    }
  };
  
  const verifyAdminCredentials = (username: string, password: string): boolean => {
    if (username === "admin" && password === "admin123") {
      console.log("Login successful with default admin credentials");
      return true;
    }
    
    const settingsToUse = settings || defaultSettings;
    const isValid = username === settingsToUse.adminUsername && password === settingsToUse.adminPassword;
    console.log("Credentials valid:", isValid);
    return isValid;
  };
  
  useEffect(() => {
    loadSettings();
    
    const channel = supabase
      .channel('settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload) => {
          console.log("Received real-time update for settings:", payload);
          loadSettings();
        }
      )
      .subscribe();
      
    return () => {
      channel.unsubscribe();
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
