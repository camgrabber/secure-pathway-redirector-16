
import React, { useState } from 'react';
import { Save, RefreshCw, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';

export const SecurityTab = () => {
  const { toast } = useToast();
  const { settings, updateSettings, resetToDefaults: resetSettingsToDefaults } = useSettingsManager();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    adminUsername: settings.adminUsername || '',
    adminPassword: '',
    defaultDestinationUrl: settings.defaultDestinationUrl || 'https://example.com'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value
    });
  };

  const handleUpdateCredentials = async () => {
    setLoading(true);
    
    if (!formValues.adminUsername) {
      toast({
        title: 'Validation Error',
        description: 'Username cannot be empty',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
    
    // If password field is empty, don't update password
    const updates: Record<string, string> = {
      adminUsername: formValues.adminUsername
    };
    
    // Only update password if it's provided
    if (formValues.adminPassword) {
      if (formValues.adminPassword.length < 8) {
        toast({
          title: 'Security Warning',
          description: 'Password should be at least 8 characters long',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      updates.adminPassword = formValues.adminPassword;
    }
    
    try {
      const result = await updateSettings(updates);
      
      if (result && result.success) {
        toast({
          title: 'Credentials Updated',
          description: 'Admin credentials have been successfully updated',
        });
        
        // Clear password field after successful update
        setFormValues({
          ...formValues,
          adminPassword: ''
        });
      } else {
        throw new Error('Update returned no success indication');
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'There was a problem updating credentials. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to update credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDefaultDestination = async () => {
    setLoading(true);
    
    try {
      // Basic URL validation
      let url = formValues.defaultDestinationUrl;
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      
      const result = await updateSettings({
        defaultDestinationUrl: url
      });
      
      if (result && result.success) {
        // Update local form value with potentially modified URL
        setFormValues({
          ...formValues,
          defaultDestinationUrl: url
        });
        
        toast({
          title: 'Default Destination Updated',
          description: 'Default destination URL has been saved',
        });
      } else {
        throw new Error('Update returned no success indication');
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'There was a problem updating the default destination',
        variant: 'destructive',
      });
      console.error('Failed to update default destination:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettingsToDefaults = () => {
    if (window.confirm('Reset all application settings to default? This cannot be undone.')) {
      setLoading(true);
      resetSettingsToDefaults()
        .then((result) => {
          if (result && result.success) {
            toast({
              title: 'Reset Complete',
              description: 'Application settings have been reset to defaults',
            });
            // Update form values with default settings
            setFormValues({
              adminUsername: 'admin',
              adminPassword: '',
              defaultDestinationUrl: 'https://example.com'
            });
          } else {
            throw new Error('Reset returned no success indication');
          }
        })
        .catch((error) => {
          toast({
            title: 'Reset Failed',
            description: 'There was a problem resetting settings',
            variant: 'destructive',
          });
          console.error('Failed to reset settings:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Credentials
          </CardTitle>
          <CardDescription>Change your admin username and password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="adminUsername">Username</Label>
              <Input
                id="adminUsername"
                type="text"
                value={formValues.adminUsername}
                onChange={handleInputChange}
                placeholder="Enter new username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adminPassword">Password</Label>
              <div className="relative">
                <Input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  value={formValues.adminPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password (leave empty to keep current)"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Password should be at least 8 characters long for better security.
                Leave empty to keep current password.
              </p>
            </div>
            <Button 
              onClick={handleUpdateCredentials} 
              className="mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Credentials
                </>
              )}
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
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="defaultDestinationUrl">Default Destination URL</Label>
              <Input
                id="defaultDestinationUrl"
                type="url"
                value={formValues.defaultDestinationUrl}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
            <Button 
              onClick={handleSaveDefaultDestination} 
              className="mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Default URL
                </>
              )}
            </Button>
          </div>
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
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Resetting...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset All Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
