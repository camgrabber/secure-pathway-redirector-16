
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, Layout, Type, Clock, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdsTab } from './AdsTab';
import { SecurityTab } from './SecurityTab';
import { ContentTab } from './ContentTab';
import { TimersTab } from './TimersTab';
import SEOSettingsTab from './SEOSettingsTab';
import { useSettingsManager } from '@/utils/settingsManager';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('ads');
  const { refreshSettings } = useSettingsManager();

  const handleLogout = () => {
    onLogout();
    sessionStorage.removeItem('adminLoggedIn');
  };

  // Handle tab change - refresh settings when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    refreshSettings();
  };

  // Refresh settings on initial load
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

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
        
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="mb-6">
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
