
import React, { useEffect } from 'react';
import { useSettingsManager } from '@/utils/settingsManager';
import { AdminCredentialsCard } from './security/AdminCredentialsCard';
import { DefaultDestinationCard } from './security/DefaultDestinationCard';
import { ResetSettingsCard } from './security/ResetSettingsCard';

export const SecurityTab = () => {
  const { settings, refreshSettings } = useSettingsManager();

  // Force refresh settings when the component mounts
  useEffect(() => {
    console.log("SecurityTab: Mounting, refreshing settings");
    refreshSettings();
  }, [refreshSettings]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <AdminCredentialsCard 
        initialUsername={settings.adminUsername || ''}
      />
      
      <DefaultDestinationCard 
        initialUrl={settings.defaultDestinationUrl || ''}
      />
      
      <ResetSettingsCard 
        onResetSettings={refreshSettings}
      />
    </div>
  );
};
