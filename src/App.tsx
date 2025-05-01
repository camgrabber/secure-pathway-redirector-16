
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import InitialRedirect from "./pages/InitialRedirect";
import SecurityCheck from "./pages/SecurityCheck";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { AdBlockerDetected } from "./components/AdBlockerDetected";
import { checkForAdBlocker, forceCheckForAdBlocker } from "./utils/adBlockDetector";
import { useSettingsManager } from "./utils/settingsManager";

// Create a new QueryClient for React Query
const queryClient = new QueryClient();

// Component to handle route changes and recheck for adblockers
const AdBlockerDetectionWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [adBlockerDetected, setAdBlockerDetected] = useState<boolean | null>(null);
  const [bypassAdBlocker, setBypassAdBlocker] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const { refreshSettings, settings } = useSettingsManager();

  // Effect for initial load and route changes
  useEffect(() => {
    const checkAdBlocker = async () => {
      console.log("Checking for ad blocker on route change:", location.pathname);
      
      // Refresh settings on route change to ensure we have latest data
      try {
        await refreshSettings();
        console.log("Settings refreshed on route change");
      } catch (e) {
        console.error("Failed to refresh settings on route change", e);
      }
      
      // Check if user has bypassed for this session only
      const sessionBypass = sessionStorage.getItem('adBlockerBypass') === 'true';
      if (sessionBypass) {
        console.log("Ad blocker bypass found in session storage");
        setBypassAdBlocker(true);
        setCheckComplete(true);
        return;
      }
      
      // Perform the check
      const isBlocked = await checkForAdBlocker();
      setAdBlockerDetected(isBlocked);
      setCheckComplete(true);
    };
    
    checkAdBlocker();
  }, [location.pathname, refreshSettings]);

  const handleContinueAnyway = () => {
    setBypassAdBlocker(true);
    sessionStorage.setItem('adBlockerBypass', 'true');
  };

  // Reset bypass when adBlockerDetected changes (e.g., when user turns on adblocker)
  useEffect(() => {
    if (adBlockerDetected === true) {
      // Only reset bypass if we've confirmed an adblocker is active now
      setBypassAdBlocker(false);
    }
  }, [adBlockerDetected]);

  // Add an interval to periodically check for adblocker changes
  useEffect(() => {
    const intervalId = setInterval(async () => {
      // Only do periodic checks if we're not showing the modal
      if (!adBlockerDetected || bypassAdBlocker) {
        const isBlocked = await checkForAdBlocker();
        if (isBlocked) {
          console.log("Periodic check detected ad blocker");
          setAdBlockerDetected(true);
        }
      }
    }, 15000); // Check every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [adBlockerDetected, bypassAdBlocker]);

  if (adBlockerDetected === true && !bypassAdBlocker) {
    return <AdBlockerDetected onContinueAnyway={handleContinueAnyway} />;
  }

  if (checkComplete) {
    return <>{children}</>;
  }

  // Loading state while checking - now with customizable content from settings
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="text-center max-w-md px-4">
        {settings?.loadingImageUrl && (
          <img 
            src={settings.loadingImageUrl} 
            alt="Loading" 
            className="mx-auto mb-6 max-h-32 object-contain" 
          />
        )}
        <div className="w-12 h-12 border-4 border-redirector-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">{settings?.loadingTitle || "Initializing secure pathway..."}</p>
        <p className="text-sm text-gray-500 mt-2">{settings?.loadingSubtitle || "Please wait while we verify your browser compatibility"}</p>
      </div>
    </div>
  );
};

const App = () => {
  // Debug info for Netlify deployment
  useEffect(() => {
    console.log("App component mounted");
    console.log("Current route:", window.location.pathname);
    
    // Add event listener for visibility changes (tab switching)
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible") {
        console.log("Tab became visible again, rechecking adblock status");
        await forceCheckForAdBlocker();
      }
    });
    
    return () => {
      document.removeEventListener("visibilitychange", async () => {});
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdBlockerDetectionWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/initial-redirect" element={<InitialRedirect />} />
              <Route path="/security-check" element={<SecurityCheck />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdBlockerDetectionWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
