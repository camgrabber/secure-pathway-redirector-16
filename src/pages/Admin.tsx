
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useSettingsManager } from '@/utils/settingsManager';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const { isLoaded } = useSettingsManager();
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
    
    setInitializing(false);
  }, [isLoaded]);

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
