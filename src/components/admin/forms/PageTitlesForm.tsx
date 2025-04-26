
import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface PageTitlesFormProps {
  settings: {
    initialTitle?: string;
    initialSubtitle?: string;
    securityTitle?: string;
    securitySubtitle?: string;
    confirmationTitle?: string;
    confirmationSubtitle?: string;
  };
  onSave: (section: string) => Promise<void>;
}

export const PageTitlesForm = ({ settings, onSave }: PageTitlesFormProps) => {
  return (
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
          
          <Button type="button" onClick={() => onSave('titles')} className="mt-2">
            <Save className="mr-2 h-4 w-4" />
            Save Content
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
