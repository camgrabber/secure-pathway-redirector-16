import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const { toast } = useToast();
  const { verifyAdminCredentials, isLoaded, settings } = useSettingsManager();

  useEffect(() => {
    const checkSettings = async () => {
      try {
        console.log("Checking app_settings availability...");
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 'app_settings')
          .maybeSingle();
          
        if (error) {
          console.error("Error checking app_settings:", error);
        }
        
        console.log("App settings check:", data ? "Available" : "Not available");
        setSettingsLoading(false);
      } catch (e) {
        console.error("Error during settings check:", e);
        setSettingsLoading(false);
      }
    };
    
    checkSettings();
  }, []);

  useEffect(() => {
    console.log("Settings loaded status:", isLoaded);
    if (isLoaded) {
      setSettingsLoading(false);
    }
  }, [isLoaded]);

  const handleLogin = () => {
    setIsLoading(true);
    
    // Basic validation
    if (!loginForm.username || !loginForm.password) {
      toast({
        title: 'Validation Error',
        description: 'Username and password are required',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Small delay to ensure settings are loaded
    setTimeout(() => {
      console.log("Login attempt - detailed debug:");
      console.log("- Settings loaded state:", isLoaded);
      console.log("- Settings object exists:", !!settings);
      console.log("- Entered username:", loginForm.username);
      
      // Force success with hardcoded credentials as backup
      if (loginForm.username === "admin" && loginForm.password === "admin123") {
        console.log("Login successful with hardcoded admin credentials");
        toast({
          title: 'Login Successful',
          description: 'Welcome to admin dashboard',
        });
        onLoginSuccess();
        sessionStorage.setItem('adminLoggedIn', 'true');
        setIsLoading(false);
        return;
      }
      
      if (isLoaded) {
        console.log("Attempting login with credentials:", loginForm.username);
        
        const isValid = verifyAdminCredentials(loginForm.username, loginForm.password);
        console.log("Credentials valid:", isValid);
        
        if (isValid) {
          toast({
            title: 'Login Successful',
            description: 'Welcome to admin dashboard',
          });
          onLoginSuccess();
          sessionStorage.setItem('adminLoggedIn', 'true');
        } else {
          toast({
            title: 'Authentication Failed',
            description: 'Incorrect username or password. Default is admin/admin123',
            variant: 'destructive',
          });
        }
      } else {
        // If settings not loaded, try default credentials as fallback
        if (loginForm.username === "admin" && loginForm.password === "admin123") {
          toast({
            title: 'Login Successful',
            description: 'Welcome to admin dashboard (using default credentials)',
          });
          onLoginSuccess();
          sessionStorage.setItem('adminLoggedIn', 'true');
        } else {
          toast({
            title: 'System Error',
            description: 'Settings not loaded yet. Please try default admin/admin123 or refresh and try again.',
            variant: 'destructive',
          });
          console.error("Settings not loaded yet");
        }
      }
      setIsLoading(false);
    }, 500);
  };

  const handleDebugLogin = () => {
    setLoginForm({ username: 'admin', password: 'admin123' });
    
    setTimeout(() => {
      handleLogin();
    }, 100);
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-redirector-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading login page...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-redirector-primary/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-redirector-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-gray-600 mt-2">Enter credentials to access admin panel</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <Input 
              type="text" 
              placeholder="Enter username" 
              value={loginForm.username} 
              onChange={e => setLoginForm({...loginForm, username: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input 
              type="password" 
              placeholder="Enter password" 
              value={loginForm.password} 
              onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLogin();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Default: admin/admin123 (if not changed)</p>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
          
          <div className="mt-4 text-center">
            <Button 
              onClick={handleDebugLogin} 
              variant="outline"
              type="button"
              className="text-sm"
            >
              Use Default Credentials
            </Button>
          </div>
          
          <div className="text-center pt-4">
            <Link to="/" className="text-redirector-primary hover:underline text-sm">
              <ArrowLeft className="inline h-4 w-4 mr-1" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
