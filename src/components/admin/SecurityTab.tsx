
import React from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';

export const SecurityTab = () => {
  const { toast } = useToast();
  const { settings, updateSettings, resetToDefaults: resetSettingsToDefaults } = useSettingsManager();

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

  const handleResetSettingsToDefaults = () => {
    if (window.confirm('Reset all application settings to default? This cannot be undone.')) {
      resetSettingsToDefaults();
      toast({
        title: 'Reset Complete',
        description: 'Application settings have been reset to defaults',
      });
    }
  };

  const handleSaveSettings = (section: string) => {
    const formElement = document.getElementById(`${section}-form`) as HTMLFormElement;
    if (!formElement) return;
    
    const formData = new FormData(formElement);
    const updates: Record<string, string | number> = {};
    
    formData.forEach((value, key) => {
      updates[key] = value as string;
    });
    
    updateSettings(updates);
    
    toast({
      title: 'Settings Saved',
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated`,
    });
  };

  return (
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
  );
};
