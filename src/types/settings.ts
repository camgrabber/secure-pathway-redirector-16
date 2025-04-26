
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
  
  // Social media URLs
  whatsappUrl: string;
  instagramUrl: string;
  twitterUrl: string;
}

export const SETTINGS_ID = 'app_settings';
