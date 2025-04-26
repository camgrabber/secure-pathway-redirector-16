
import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ButtonLabelsFormProps {
  settings: {
    initialButtonText?: string;
    securityButtonText?: string;
    confirmationButtonText?: string;
    copyLinkButtonText?: string;
    securityBadgeText?: string;
    footerText?: string;
  };
  onSave: (section: string) => Promise<void>;
}

export const ButtonLabelsForm = ({ settings, onSave }: ButtonLabelsFormProps) => {
  return (
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
          
          <Button type="button" onClick={() => onSave('labels')} className="mt-2">
            <Save className="mr-2 h-4 w-4" />
            Save Labels
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
