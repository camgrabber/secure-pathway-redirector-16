
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Save,
  Trash,
  Plus,
  Eye,
  EyeOff,
  ArrowLeft,
  RefreshCw,
  Lock,
  Settings,
  Clock,
  Type,
  Layout
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { useAdManager, AdUnit } from '../utils/adManager';
import { useSettingsManager } from '../utils/settingsManager';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const Admin = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [editingAd, setEditingAd] = useState<AdUnit | null>(null);
  const [newAdForm, setNewAdForm] = useState<{
    name: string;
    position: string;
    code: string;
  }>({
    name: '',
    position: 'top',
    code: '',
  });
  const [activeTab, setActiveTab] = useState('ads');
  
  const { toast } = useToast();
  const { 
    adUnits, 
    addAdUnit, 
    updateAdUnit, 
    deleteAdUnit, 
    toggleAdActive, 
    resetToDefaults: resetAdsToDefaults
  } = useAdManager();
  
  const {
    settings,
    updateSettings,
    resetToDefaults: resetSettingsToDefaults,
    verifyAdminCredentials,
    isLoaded
  } = useSettingsManager();
  
  // Check if user is already logged in via session storage
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
  
  const handleSaveAd = () => {
    if (!editingAd) return;
    
    updateAdUnit(editingAd.id, editingAd);
    setEditingAd(null);
    toast({
      title: 'Ad Updated',
      description: 'Ad unit has been saved successfully',
    });
  };
  
  const handleCreateAd = () => {
    if (!newAdForm.name || !newAdForm.position || !newAdForm.code) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    addAdUnit({
      name: newAdForm.name,
      position: newAdForm.position,
      code: newAdForm.code,
      active: true,
    });
    
    setNewAdForm({
      name: '',
      position: 'top',
      code: '',
    });
    
    toast({
      title: 'Ad Created',
      description: 'New ad unit has been created successfully',
    });
  };
  
  const handleResetAdsToDefaults = () => {
    if (window.confirm('Reset all ads to default settings? This cannot be undone.')) {
      resetAdsToDefaults();
      toast({
        title: 'Reset Complete',
        description: 'Ad units have been reset to defaults',
      });
    }
  };
  
  const handleResetSettingsToDefaults = () => {
    if (window.confirm('Reset all application settings to default? This cannot be undone.')) {
      resetSettingsToDefaults();
      toast({
        title: 'Reset Complete',
        description: 'Application settings have been reset to defaults',
      });
    }
  };
  
  const handleUpdateCredentials = () => {
    const newUsername = (document.getElementById('adminUsername') as HTMLInputElement)?.value;
    const newPassword = (document.getElementById('adminPassword') as HTMLInputElement)?.value;
    
    if (!newUsername || !newPassword) {
      toast({
        title: 'Validation Error',
        description: 'Username and password cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: 'Security Warning',
        description: 'Password should be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }
    
    updateSettings({
      adminUsername: newUsername,
      adminPassword: newPassword,
    });
    
    toast({
      title: 'Credentials Updated',
      description: 'Admin credentials have been successfully updated',
    });
  };
  
  const handleSaveSettings = (section: string) => {
    const formElement = document.getElementById(`${section}-form`) as HTMLFormElement;
    if (!formElement) return;
    
    const formData = new FormData(formElement);
    const updates: Record<string, string | number> = {};
    
    // Convert form data to settings object with proper type handling
    formData.forEach((value, key) => {
      // Skip File objects - we're not handling file uploads in settings
      if (value instanceof File) {
        return;
      }
      
      // Convert numeric values
      if (key.includes('Seconds') || key.includes('Duration')) {
        const numValue = parseInt(value as string, 10);
        updates[key] = isNaN(numValue) ? 0 : numValue;
      } else {
        updates[key] = value as string;
      }
    });
    
    updateSettings(updates);
    
    toast({
      title: 'Settings Saved',
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated`,
    });
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
              <Label htmlFor="admin-username">Username</Label>
              <Input 
                id="admin-username"
                type="text" 
                placeholder="Enter username" 
                value={loginForm.username} 
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input 
                id="admin-password"
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
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="ads">
              <Layout className="w-4 h-4 mr-2" />
              Ads Manager
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
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
          </TabsList>
          
          {/* Ads Manager Tab */}
          <TabsContent value="ads" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Ads List */}
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Current Ad Units</h2>
                  <Button onClick={handleResetAdsToDefaults} variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset to Defaults
                  </Button>
                </div>
                
                {adUnits.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No ad units found</p>
                ) : (
                  <div className="space-y-4">
                    {adUnits.map(ad => (
                      <div 
                        key={ad.id}
                        className={`border rounded-lg p-4 ${editingAd?.id === ad.id ? 'border-redirector-primary' : 'border-gray-200'}`}
                      >
                        {editingAd?.id === ad.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium block mb-1">Ad Name</label>
                              <Input
                                value={editingAd.name}
                                onChange={e => setEditingAd({...editingAd, name: e.target.value})}
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium block mb-1">Position</label>
                              <select 
                                value={editingAd.position}
                                onChange={e => setEditingAd({...editingAd, position: e.target.value})}
                                className="w-full border border-gray-300 rounded-md p-2"
                              >
                                <option value="top">Top</option>
                                <option value="middle">Middle</option>
                                <option value="after-timer">After Timer</option>
                                <option value="bottom">Bottom</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium block mb-1">Ad Code</label>
                              <Textarea
                                value={editingAd.code}
                                onChange={e => setEditingAd({...editingAd, code: e.target.value})}
                                rows={5}
                              />
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setEditingAd(null)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleSaveAd}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{ad.name}</h3>
                                <p className="text-sm text-gray-500">Position: {ad.position}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => toggleAdActive(ad.id)}
                                  title={ad.active ? "Disable ad" : "Enable ad"}
                                >
                                  {ad.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingAd(ad)}
                                  title="Edit ad"
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this ad?')) {
                                      deleteAdUnit(ad.id);
                                      toast({
                                        title: 'Ad Deleted',
                                        description: 'Ad unit has been removed',
                                      });
                                    }
                                  }}
                                  title="Delete ad"
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-auto max-h-24">
                              {ad.code.substring(0, 150)}...
                            </div>
                            <div className="mt-2 text-sm">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ad.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {ad.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Add New Ad Form */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Add New Ad Unit</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Ad Name</label>
                    <Input
                      placeholder="Banner Ad Top"
                      value={newAdForm.name}
                      onChange={e => setNewAdForm({...newAdForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Position</label>
                    <select 
                      value={newAdForm.position}
                      onChange={e => setNewAdForm({...newAdForm, position: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="top">Top</option>
                      <option value="middle">Middle</option>
                      <option value="after-timer">After Timer</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Ad Code</label>
                    <Textarea
                      placeholder="Paste ad code here..."
                      value={newAdForm.code}
                      onChange={e => setNewAdForm({...newAdForm, code: e.target.value})}
                      rows={8}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the ad provider's JavaScript code here
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleCreateAd}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Ad Unit
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Credentials</CardTitle>
                  <CardDescription>Change your admin username and password</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="adminUsername">Username</Label>
                      <Input
                        id="adminUsername"
                        type="text"
                        defaultValue={settings.adminUsername}
                        placeholder="Enter new username"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                      <p className="text-xs text-gray-500">
                        Password should be at least 8 characters long for better security
                      </p>
                    </div>
                    <Button onClick={handleUpdateCredentials} className="mt-2">
                      <Save className="mr-2 h-4 w-4" />
                      Update Credentials
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Default Destination</CardTitle>
                  <CardDescription>Set the default destination URL when none is provided</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="defaults-form" className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="defaultDestinationUrl">Default Destination URL</Label>
                      <Input
                        id="defaultDestinationUrl"
                        name="defaultDestinationUrl"
                        type="url"
                        defaultValue={settings.defaultDestinationUrl}
                        placeholder="https://example.com"
                      />
                    </div>
                    <Button type="button" onClick={() => handleSaveSettings('defaults')} className="mt-2">
                      <Save className="mr-2 h-4 w-4" />
                      Save Default Settings
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reset All Settings</CardTitle>
                  <CardDescription>Reset all application settings to their default values</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive"
                    onClick={handleResetSettingsToDefaults}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset All Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Page Titles & Subtitles</CardTitle>
                  <CardDescription>Customize the text displayed on each page</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="titles-form" className="grid gap-4">
                    <div className="border-b pb-2">
                      <h3 className="text-md font-semibold mb-2">Initial Page</h3>
                      <div className="grid gap-2 mb-2">
                        <Label htmlFor="initialTitle">Title</Label>
                        <Input
                          id="initialTitle"
                          name="initialTitle"
                          defaultValue={settings.initialTitle}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="initialSubtitle">Subtitle</Label>
                        <Input
                          id="initialSubtitle"
                          name="initialSubtitle"
                          defaultValue={settings.initialSubtitle}
                        />
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <h3 className="text-md font-semibold mb-2">Security Check Page</h3>
                      <div className="grid gap-2 mb-2">
                        <Label htmlFor="securityTitle">Title</Label>
                        <Input
                          id="securityTitle"
                          name="securityTitle"
                          defaultValue={settings.securityTitle}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="securitySubtitle">Subtitle</Label>
                        <Input
                          id="securitySubtitle"
                          name="securitySubtitle"
                          defaultValue={settings.securitySubtitle}
                        />
                      </div>
                    </div>
                    
                    <div className="pb-2">
                      <h3 className="text-md font-semibold mb-2">Confirmation Page</h3>
                      <div className="grid gap-2 mb-2">
                        <Label htmlFor="confirmationTitle">Title</Label>
                        <Input
                          id="confirmationTitle"
                          name="confirmationTitle"
                          defaultValue={settings.confirmationTitle}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirmationSubtitle">Subtitle</Label>
                        <Input
                          id="confirmationSubtitle"
                          name="confirmationSubtitle"
                          defaultValue={settings.confirmationSubtitle}
                        />
                      </div>
                    </div>
                    
                    <Button type="button" onClick={() => handleSaveSettings('titles')} className="mt-2">
                      <Save className="mr-2 h-4 w-4" />
                      Save Content
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Button Text & Other Labels</CardTitle>
                  <CardDescription>Customize button text and other UI elements</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="labels-form" className="grid gap-4">
                    <div className="border-b pb-2">
                      <h3 className="text-md font-semibold mb-2">Button Labels</h3>
                      <div className="grid gap-2 mb-2">
                        <Label htmlFor="initialButtonText">Initial Page Button</Label>
                        <Input
                          id="initialButtonText"
                          name="initialButtonText"
                          defaultValue={settings.initialButtonText}
                        />
                      </div>
                      <div className="grid gap-2 mb-2">
                        <Label htmlFor="securityButtonText">Security Page Button</Label>
                        <Input
                          id="securityButtonText"
                          name="securityButtonText"
                          defaultValue={settings.securityButtonText}
                        />
                      </div>
                      <div className="grid gap-2 mb-2">
                        <Label htmlFor="confirmationButtonText">Confirmation Page Button</Label>
                        <Input
                          id="confirmationButtonText"
                          name="confirmationButtonText"
                          defaultValue={settings.confirmationButtonText}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="copyLinkButtonText">Copy Link Button</Label>
                        <Input
                          id="copyLinkButtonText"
                          name="copyLinkButtonText"
                          defaultValue={settings.copyLinkButtonText}
                        />
                      </div>
                    </div>
                    
                    <div className="pb-2">
                      <h3 className="text-md font-semibold mb-2">Other Text</h3>
                      <div className="grid gap-2 mb-2">
                        <Label htmlFor="securityBadgeText">Security Badge Text</Label>
                        <Input
                          id="securityBadgeText"
                          name="securityBadgeText"
                          defaultValue={settings.securityBadgeText}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="footerText">Footer Text</Label>
                        <Input
                          id="footerText"
                          name="footerText"
                          defaultValue={settings.footerText}
                        />
                      </div>
                    </div>
                    
                    <Button type="button" onClick={() => handleSaveSettings('labels')} className="mt-2">
                      <Save className="mr-2 h-4 w-4" />
                      Save Labels
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Timers Tab */}
          <TabsContent value="timers" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Timer Settings</CardTitle>
                <CardDescription>Customize countdown and security scan timers</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="timers-form" className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="initialTimerSeconds">Initial Page Timer (seconds)</Label>
                      <Input
                        id="initialTimerSeconds"
                        name="initialTimerSeconds"
                        type="number"
                        min="1"
                        max="60"
                        defaultValue={settings.initialTimerSeconds}
                      />
                      <p className="text-xs text-gray-500">
                        Countdown time before showing the continue button
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="securityScanDurationMs">Security Scan Duration (ms)</Label>
                      <Input
                        id="securityScanDurationMs"
                        name="securityScanDurationMs"
                        type="number"
                        min="1000"
                        step="1000"
                        defaultValue={settings.securityScanDurationMs}
                      />
                      <p className="text-xs text-gray-500">
                        Total time for security scan process (in milliseconds)
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="confirmationTimerSeconds">Confirmation Page Timer (seconds)</Label>
                      <Input
                        id="confirmationTimerSeconds"
                        name="confirmationTimerSeconds"
                        type="number"
                        min="1"
                        max="30"
                        defaultValue={settings.confirmationTimerSeconds}
                      />
                      <p className="text-xs text-gray-500">
                        Countdown time before showing the proceed button
                      </p>
                    </div>
                  </div>
                  
                  <Button type="button" onClick={() => handleSaveSettings('timers')} className="mt-2">
                    <Save className="mr-2 h-4 w-4" />
                    Save Timer Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
