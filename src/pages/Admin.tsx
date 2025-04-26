
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
    
    // Initialize app settings in DB if needed
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
          
          // Try to use settingsService for consistency
          await refreshSettings();
        } else {
          console.log("Admin: App settings found in database:", data);
          // Force a refresh to ensure we have the latest data
          await refreshSettings();
        }
      } catch (e) {
        console.error("Admin: Error checking/initializing app_settings:", e);
      } finally {
        setInitializing(false);
      }
    };
    
    initializeSettings();
    
    // Set up a periodic refresh to ensure data is current
    const refreshIntervalId = setInterval(() => {
      console.log("Admin: Scheduled refresh of settings");
      refreshSettings();
    }, 5000); // Refresh every 5 seconds (more frequently in admin)
    
    return () => {
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
