
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, Layout, Type, Clock, Search, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdsTab } from './AdsTab';
import { SecurityTab } from './SecurityTab';
import { ContentTab } from './ContentTab';
import { TimersTab } from './TimersTab';
import SEOSettingsTab from './SEOSettingsTab';
import { useSettingsManager } from '@/utils/settingsManager';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('ads');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshSettings } = useSettingsManager();
  const { toast } = useToast();

  const handleLogout = () => {
    onLogout();
    sessionStorage.removeItem('adminLoggedIn');
  };

  // Handle tab change - refresh settings when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log("AdminDashboard: Tab changed to", value, "refreshing settings");
    handleForceRefresh();
  };

  // Aggressive refresh that retries multiple times
  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    console.log("AdminDashboard: Forcing aggressive settings refresh");
    
    try {
      // First refresh
      await refreshSettings();
      
      // Set up multiple delayed refreshes to ensure we get the data
      const delays = [1000, 2000, 3000]; // 1s, 2s, 3s delays
      
      for (const delay of delays) {
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`AdminDashboard: Delayed refresh after ${delay}ms`);
        await refreshSettings();
      }
      
      toast({
        title: 'Settings refreshed',
        description: 'Latest settings have been loaded',
      });
    } catch (error) {
      console.error("AdminDashboard: Error during aggressive refresh:", error);
      toast({
        title: 'Refresh Error',
        description: 'Failed to refresh settings data',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Refresh settings on initial load and regularly
  useEffect(() => {
    console.log("AdminDashboard: Initial mounting, refreshing settings");
    handleForceRefresh();
    
    // Set up a periodic refresh to ensure data is current
    const intervalId = setInterval(() => {
      console.log("AdminDashboard: Periodic refresh of settings");
      refreshSettings();
    }, 5000); // Refresh every 5 seconds
    
    return () => {
      clearInterval(intervalId);
    };
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
              <Button 
                onClick={handleForceRefresh} 
                variant="outline"
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Settings
                  </>
                )}
              </Button>
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
