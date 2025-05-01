import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsService } from './settingsService';
import { AppSettings } from '@/types/settings';
import { defaultSettings } from './defaultSettings';

// Create the settings context
interface SettingsContextProps {
  settings: AppSettings;
  isLoaded: boolean;
  updateSettings: (updates: Partial<AppSettings>) => Promise<{ success: boolean }>;
  refreshSettings: () => Promise<void>;
  verifyAdminCredentials: (username: string, password: string) => boolean;
}

const SettingsContext = createContext<SettingsContextProps>({
  settings: defaultSettings,
  isLoaded: false,
  updateSettings: async () => ({ success: false }),
  refreshSettings: async () => { },
  verifyAdminCredentials: () => false,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshSettings = useCallback(async () => {
    try {
      console.log("SettingsManager: Performing periodic refresh");
      const loadedSettings = await settingsService.loadSettings();

      if (loadedSettings) {
        setSettings(loadedSettings);
        setIsLoaded(true);
        console.log("SettingsManager: Settings loaded successfully:", loadedSettings);
      } else {
        console.log("SettingsManager: Using default settings");
        setSettings(defaultSettings);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("SettingsManager: Error loading settings:", error);
    }
  }, []);

  useEffect(() => {
    refreshSettings();

    const intervalId = setInterval(refreshSettings, 5000);

    return () => clearInterval(intervalId);
  }, [refreshSettings]);

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      const result = await settingsService.updateSettings(updates);
      if (result) {
        refreshSettings();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("SettingsManager: Error updating settings:", error);
      return { success: false };
    }
  };

  const verifyAdminCredentials = (username: string, password: string) => {
    return username === settings.adminUsername && password === settings.adminPassword;
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoaded, updateSettings, refreshSettings, verifyAdminCredentials }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsManager = () => useContext(SettingsContext);
