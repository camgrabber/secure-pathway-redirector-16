
import { AppSettings } from '@/types/settings';

export const defaultSettings: AppSettings = {
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
  defaultDestinationUrl: "https://example.com",
  
  // Social media URLs
  whatsappUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  telegramUrl: "",
  
  // Loading screen settings
  loadingTitle: "Initializing secure pathway...",
  loadingSubtitle: "Please wait while we verify your browser compatibility",
  loadingImageUrl: ""
};
