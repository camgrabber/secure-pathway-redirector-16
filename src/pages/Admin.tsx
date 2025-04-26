
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useSettingsManager } from '@/utils/settingsManager';

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { isLoaded } = useSettingsManager();
  
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return <LoginForm onLoginSuccess={() => setAuthenticated(true)} />;
  }
  
  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
};

export default Admin;
