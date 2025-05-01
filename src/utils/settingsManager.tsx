
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
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  // Add refreshSettings function
  const refreshSettings = useCallback(async () => {
    try {
      console.log("SettingsManager: Performing refresh, last refresh was", 
                  new Date(lastRefresh).toISOString());
      
      const loadedSettings = await settingsService.forceRefreshSettings();

      if (loadedSettings) {
        console.log("SettingsManager: Settings loaded successfully:", loadedSettings);
        setSettings(prev => ({...prev, ...loadedSettings}));
        setIsLoaded(true);
        setLastRefresh(Date.now());
      } else {
        console.log("SettingsManager: No settings found, using defaults");
        setSettings(defaultSettings);
        setIsLoaded(true);
      }
      
      // Log all social media URLs
      console.log("SettingsManager: Social Media URLs after refresh:", {
        whatsapp: loadedSettings?.whatsappUrl || 'none',
        instagram: loadedSettings?.instagramUrl || 'none',
        telegram: loadedSettings?.telegramUrl || 'none',
        twitter: loadedSettings?.twitterUrl || 'none',
      });
    } catch (error) {
      console.error("SettingsManager: Error loading settings:", error);
    }
  }, [lastRefresh]);

  // Initial load and periodic refresh
  useEffect(() => {
    refreshSettings();

    const intervalId = setInterval(refreshSettings, 5000);

    return () => clearInterval(intervalId);
  }, [refreshSettings]);

  // Add updateSettings function
  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      console.log("SettingsManager: Updating settings with:", updates);
      
      const result = await settingsService.updateSettings(updates);
      if (result.success) {
        // Apply updates locally first for immediate UI response
        setSettings(prev => ({...prev, ...updates}));
        // Then refresh to ensure consistency
        await refreshSettings();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("SettingsManager: Error updating settings:", error);
      return { success: false };
    }
  };

  // Add verifyAdminCredentials function
  const verifyAdminCredentials = (username: string, password: string) => {
    return username === settings.adminUsername && password === settings.adminPassword;
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        isLoaded, 
        updateSettings, 
        refreshSettings, 
        verifyAdminCredentials 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsManager = () => useContext(SettingsContext);
