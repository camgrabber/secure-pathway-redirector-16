
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useSettingsManager } from '@/utils/settingsManager';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SETTINGS_ID } from '@/types/settings';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const { isLoaded, settings, refreshSettings } = useSettingsManager();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    console.log("Admin page initialization");
    console.log("- Settings loaded:", isLoaded);
    console.log("- Login state from session:", isLoggedIn);
    
    if (isLoggedIn) {
      console.log("- Auto login from session");
      setAuthenticated(true);
    }
    
    // Initialize app settings in DB if needed and set up real-time subscription
    const initializeSettings = async () => {
      try {
        console.log("Admin: Checking for app_settings in database");
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', SETTINGS_ID)
          .maybeSingle();
          
        console.log("Admin: Checking if app_settings exists:", data);
          
        if (!data || error) {
          console.log("Admin: Need to initialize app_settings");
          
          const defaultSettings = {
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
          
          console.log("Admin: Inserting default settings:", defaultSettings);
          
          const { error: insertError } = await supabase
            .from('app_settings')
            .insert({
              id: SETTINGS_ID,
              setting_value: defaultSettings
            });
            
          if (insertError) {
            console.error("Admin: Failed to initialize settings:", insertError);
            toast({
              title: 'Settings Error',
              description: 'Failed to initialize application settings',
              variant: 'destructive',
            });
            
            console.log("Admin: Trying upsert instead of insert due to error");
            
            // Try upsert as a fallback
            const { error: upsertError } = await supabase
              .from('app_settings')
              .upsert({
                id: SETTINGS_ID,
                setting_value: defaultSettings
              });
              
            if (upsertError) {
              console.error("Admin: Upsert also failed:", upsertError);
            } else {
              console.log("Admin: Upsert succeeded");
            }
          } else {
            console.log("Admin: App settings initialized successfully");
          }
        } else {
          console.log("Admin: App settings found in database:", data);
        }
        
        // Force refresh of settings to ensure we have the latest data
        await refreshSettings();
      } catch (e) {
        console.error("Admin: Error checking/initializing app_settings:", e);
      }
    };
    
    initializeSettings().then(() => {
      setInitializing(false);
    });
    
    // Enable Supabase real-time listening for app_settings table
    const channel = supabase
      .channel('admin-app_settings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload) => {
          console.log('Admin: Real-time update received for app_settings:', payload);
          // Force refresh settings when changes are detected
          refreshSettings();
        }
      )
      .subscribe((status) => {
        console.log('Admin: Realtime subscription status:', status);
      });
    
    // Schedule periodic refreshes
    const refreshIntervalId = setInterval(() => {
      console.log("Admin: Scheduled refresh of settings");
      refreshSettings();
    }, 10000); // Refresh every 10 seconds
    
    return () => {
      // Clean up real-time subscription
      console.log('Admin: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
      clearInterval(refreshIntervalId);
    };
  }, [isLoaded, toast, refreshSettings]);

  // Force refresh settings when admin page is shown
  useEffect(() => {
    if (authenticated) {
      console.log("Admin: Authenticated, refreshing settings");
      refreshSettings();
    }
  }, [authenticated, refreshSettings]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-redirector-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLoginSuccess={() => setAuthenticated(true)} />;
  }
  
  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
};

export default Admin;
