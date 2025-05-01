
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ResetSettingsCardProps {
  onResetSettings: () => Promise<any>;
}

export const ResetSettingsCard: React.FC<ResetSettingsCardProps> = ({
  onResetSettings
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleResetSettingsToDefaults = () => {
    if (window.confirm('Reset all application settings to default? This cannot be undone.')) {
      setLoading(true);
      onResetSettings()
        .then((result) => {
          if (result && result.success) {
            toast({
              title: 'Reset Complete',
              description: 'Application settings have been reset to defaults',
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
  );
};
