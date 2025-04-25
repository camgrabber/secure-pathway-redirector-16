
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import InitialRedirect from "./pages/InitialRedirect";
import SecurityCheck from "./pages/SecurityCheck";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { AdBlockerDetected } from "./components/AdBlockerDetected";
import { checkForAdBlocker } from "./utils/adBlockDetector";

const queryClient = new QueryClient();

const App = () => {
  const [adBlockerDetected, setAdBlockerDetected] = useState<boolean | null>(null);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    const detectAdBlocker = async () => {
      try {
        console.log("Starting enhanced adblock detection check...");
        
        // First check - immediate
        const initialCheck = await checkForAdBlocker();
        
        // If initial check detects an adblocker, no need for second check
        if (initialCheck) {
          console.log("Adblock detected on initial check");
          setAdBlockerDetected(true);
          setCheckComplete(true);
          return;
        }
        
        // Second check with delay - some adblockers take time to activate
        await new Promise(resolve => setTimeout(resolve, 1000));
        const secondCheck = await checkForAdBlocker();
        
        // Set the final result
        setAdBlockerDetected(initialCheck || secondCheck);
        console.log(`Adblock final detection result: ${initialCheck || secondCheck ? "BLOCKED" : "NOT BLOCKED"}`);
      } catch (error) {
        console.error("Error in adblock detection:", error);
        setAdBlockerDetected(true); // Assume blocked on error
      } finally {
        setCheckComplete(true);
      }
    };

    detectAdBlocker();
    
    // Re-check periodically in case adblocker is activated after initial load
    const intervalCheck = setInterval(async () => {
      try {
        if (!adBlockerDetected) {
          const isBlocked = await checkForAdBlocker();
          if (isBlocked) {
            console.log("Adblock detected during interval check");
            setAdBlockerDetected(true);
          }
        }
      } catch (error) {
        console.error("Error in interval adblock check:", error);
      }
    }, 15000); // Check every 15 seconds (reduced from 30)
    
    return () => clearInterval(intervalCheck);
  }, [adBlockerDetected]);

  if (adBlockerDetected === true) {
    return <AdBlockerDetected />;
  }

  // Only render the app when we've confirmed no adblocker is present and check is complete
  if (checkComplete && adBlockerDetected === false) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/initial-redirect" element={<InitialRedirect />} />
              <Route path="/security-check" element={<SecurityCheck />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show loading state while checking
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-redirector-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Initializing secure pathway...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we verify your browser compatibility</p>
      </div>
    </div>
  );
};

export default App;
