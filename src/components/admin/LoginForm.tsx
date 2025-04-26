
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { verifyAdminCredentials, isLoaded, settings } = useSettingsManager();

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
      if (isLoaded) {
        console.log("Attempting login with credentials:", loginForm.username);
        console.log("Settings loaded:", !!settings);
        
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
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
          console.log("Default credentials are admin/admin123. Please check app settings.");
        }
      } else {
        toast({
          title: 'System Error',
          description: 'Settings not loaded yet. Please try again.',
          variant: 'destructive',
        });
        console.error("Settings not loaded yet");
      }
      setIsLoading(false);
    }, 500);
  };

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
