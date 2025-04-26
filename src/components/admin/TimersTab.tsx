
import React, { useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';

export const TimersTab = () => {
  const { toast } = useToast();
  const { settings, updateSettings, refreshSettings } = useSettingsManager();

  // Refresh settings when component mounts
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const handleSaveSettings = async (section: string) => {
    const formElement = document.getElementById(`${section}-form`) as HTMLFormElement;
    if (!formElement) return;
    
    const formData = new FormData(formElement);
    const updates: Record<string, string | number> = {};
    
    formData.forEach((value, key) => {
      if (key.includes('Seconds') || key.includes('Duration')) {
        const numValue = parseInt(value as string, 10);
        updates[key] = isNaN(numValue) ? 0 : numValue;
      } else {
        updates[key] = value as string;
      }
    });
    
    try {
      const result = await updateSettings(updates);
      
      if (result && result.success) {
        // After successful update, refresh settings to ensure UI is consistent
        await refreshSettings();
        
        toast({
          title: 'Settings Saved',
          description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated`,
        });
      } else {
        throw new Error('Update returned no success indication');
      }
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: `There was a problem saving ${section} settings`,
        variant: 'destructive',
      });
      console.error(`Failed to save ${section} settings:`, error);
    }
  };

  return (
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
  );
};
