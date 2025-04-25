
// Settings configuration storage and management
import { useState, useEffect } from 'react';

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
  
  // Default destination (if none provided)
  defaultDestinationUrl: string;
}

// Default application settings
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

// Local storage key
const SETTINGS_STORAGE_KEY = 'secure-pathway-settings';

// Hook to manage application settings
export const useSettingsManager = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error('Failed to parse stored settings', e);
        setSettings(defaultSettings);
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
      }
    } else {
      setSettings(defaultSettings);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
    }
    setIsLoaded(true);
  }, []);
  
  // Save settings to localStorage
  const saveSettings = (updatedSettings: AppSettings) => {
    setSettings(updatedSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
  };
  
  // Update specific settings
  const updateSettings = (updates: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...updates };
    saveSettings(updatedSettings);
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    saveSettings(defaultSettings);
  };
  
  // Verify admin credentials
  const verifyAdminCredentials = (username: string, password: string): boolean => {
    return username === settings.adminUsername && password === settings.adminPassword;
  };
  
  return {
    settings,
    isLoaded,
    updateSettings,
    resetToDefaults,
    verifyAdminCredentials
  };
};
