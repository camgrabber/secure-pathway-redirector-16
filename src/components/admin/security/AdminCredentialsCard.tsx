
import React, { useState } from 'react';
import { Save, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';

export interface AdminCredentialsCardProps {
  initialUsername: string;
}

export const AdminCredentialsCard: React.FC<AdminCredentialsCardProps> = ({
  initialUsername
}) => {
  const { toast } = useToast();
  const { updateSettings } = useSettingsManager();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    adminUsername: initialUsername,
    adminPassword: '',
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

  return (
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
  );
};
