
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Layout, Type, Clock, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';
import { AdsTab } from '@/components/admin/AdsTab';
import { SecurityTab } from '@/components/admin/SecurityTab';
import { ContentTab } from '@/components/admin/ContentTab';
import { TimersTab } from '@/components/admin/TimersTab';
import SEOSettingsTab from '@/components/admin/SEOSettingsTab';

const Admin = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const { toast } = useToast();
  const { verifyAdminCredentials, isLoaded } = useSettingsManager();
  
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
      setAuthenticated(true);
    }
  }, []);
  
  const handleLogin = () => {
    if (isLoaded && verifyAdminCredentials(loginForm.username, loginForm.password)) {
      setAuthenticated(true);
      sessionStorage.setItem('adminLoggedIn', 'true');
    } else {
      toast({
        title: 'Authentication Failed',
        description: 'Incorrect username or password',
        variant: 'destructive',
      });
    }
  };
  
  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  if (!authenticated) {
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
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full"
            >
              Login
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
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-redirector-dark mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your redirection service settings</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <Button onClick={handleLogout} variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Exit Admin
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        <Tabs defaultValue="ads" className="mb-6">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="ads">
              <Layout className="w-4 h-4 mr-2" />
              Ads Manager
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="content">
              <Type className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="timers">
              <Clock className="w-4 h-4 mr-2" />
              Timers
            </TabsTrigger>
            <TabsTrigger value="seo">
              <Search className="w-4 h-4 mr-2" />
              SEO
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ads" className="mt-0">
            <AdsTab />
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <SecurityTab />
          </TabsContent>
          
          <TabsContent value="content" className="mt-0">
            <ContentTab />
          </TabsContent>
          
          <TabsContent value="timers" className="mt-0">
            <TimersTab />
          </TabsContent>
          
          <TabsContent value="seo" className="mt-0">
            <SEOSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
