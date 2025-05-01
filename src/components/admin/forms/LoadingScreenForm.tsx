
import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface LoadingScreenFormProps {
  settings: {
    loadingTitle?: string;
    loadingSubtitle?: string;
    loadingImageUrl?: string;
  };
  onSave: (section: string) => Promise<void>;
}

export const LoadingScreenForm = ({ settings, onSave }: LoadingScreenFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading Screen</CardTitle>
        <CardDescription>Customize the loading screen that appears when users visit your site</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="loading-screen-form" className="grid gap-4">
          <div className="grid gap-2 mb-2">
            <Label htmlFor="loadingTitle">Loading Title</Label>
            <Input
              id="loadingTitle"
              name="loadingTitle"
              defaultValue={settings.loadingTitle}
              placeholder="Initializing secure pathway..."
            />
          </div>
          
          <div className="grid gap-2 mb-2">
            <Label htmlFor="loadingSubtitle">Loading Subtitle</Label>
            <Input
              id="loadingSubtitle"
              name="loadingSubtitle"
              defaultValue={settings.loadingSubtitle}
              placeholder="Please wait while we verify your browser compatibility"
            />
          </div>
          
          <div className="grid gap-2 mb-4">
            <Label htmlFor="loadingImageUrl">Loading Image URL</Label>
            <Input
              id="loadingImageUrl"
              name="loadingImageUrl"
              defaultValue={settings.loadingImageUrl}
              placeholder="https://example.com/your-image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a URL to an image you want to display above the loading text
            </p>
          </div>
          
          <Button type="button" onClick={() => onSave('loading-screen')} className="mt-2">
            <Save className="mr-2 h-4 w-4" />
            Save Loading Screen Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
