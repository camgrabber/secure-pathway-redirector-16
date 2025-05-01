
import React, { useEffect, useState } from 'react';
import { useSettingsManager } from '@/utils/settingsManager';
import { AdminCredentialsCard } from './security/AdminCredentialsCard';
import { DefaultDestinationCard } from './security/DefaultDestinationCard';
import { ResetSettingsCard } from './security/ResetSettingsCard';

export const SecurityTab = () => {
  const { settings, resetToDefaults } = useSettingsManager();
  const [formValues, setFormValues] = useState({
    adminUsername: settings.adminUsername || '',
    defaultDestinationUrl: settings.defaultDestinationUrl || 'https://example.com'
  });

  // Update local state when settings change from external sources
  useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      adminUsername: settings.adminUsername || '',
      defaultDestinationUrl: settings.defaultDestinationUrl || 'https://example.com'
    }));
  }, [settings]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <AdminCredentialsCard 
        initialUsername={formValues.adminUsername}
      />
      
      <DefaultDestinationCard 
        initialUrl={formValues.defaultDestinationUrl}
      />
      
      <ResetSettingsCard 
        onResetSettings={resetToDefaults}
      />
    </div>
  );
};
