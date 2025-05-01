
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSettingsManager } from '@/utils/settingsManager';

export interface DefaultDestinationCardProps {
  initialUrl: string;
}

export const DefaultDestinationCard: React.FC<DefaultDestinationCardProps> = ({
  initialUrl
}) => {
  const { toast } = useToast();
  const { updateSettings } = useSettingsManager();
  const [loading, setLoading] = useState(false);
  const [defaultDestinationUrl, setDefaultDestinationUrl] = useState(initialUrl);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultDestinationUrl(e.target.value);
  };

  const handleSaveDefaultDestination = async () => {
    setLoading(true);
    
    try {
      // Basic URL validation
      let url = defaultDestinationUrl;
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      
      // Log the attempt to update the destination URL
      console.log('Attempting to update defaultDestinationUrl to:', url);
      
      const result = await updateSettings({
        defaultDestinationUrl: url
      });
      
      if (result && result.success) {
        // Update local form value with potentially modified URL
        setDefaultDestinationUrl(url);
        
        toast({
          title: 'Default Destination Updated',
          description: 'Default destination URL has been saved',
        });
        
        console.log('Default destination updated successfully to:', url);
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

  return (
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
              value={defaultDestinationUrl}
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
  );
};
