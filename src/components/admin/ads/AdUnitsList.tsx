
import React from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdUnit } from '@/utils/ads/types';
import { AdUnitCard } from './AdUnitCard';
import { AdUnitEditor } from './AdUnitEditor';

interface AdUnitsListProps {
  adUnits: AdUnit[];
  loading: boolean;
  editingAd: AdUnit | null;
  setEditingAd: React.Dispatch<React.SetStateAction<AdUnit | null>>;
  onSaveAd: () => Promise<void>;
  onToggleActive: (id: string) => Promise<void>;
  onDeleteAd: (id: string) => Promise<void>;
  onResetToDefaults: () => Promise<void>;
}

export const AdUnitsList: React.FC<AdUnitsListProps> = ({ 
  adUnits,
  loading,
  editingAd,
  setEditingAd,
  onSaveAd,
  onToggleActive,
  onDeleteAd,
  onResetToDefaults
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-redirector-primary" />
        <p className="ml-2 text-lg">Loading ad units...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Current Ad Units</h2>
        <Button onClick={onResetToDefaults} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>
      
      {adUnits.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No ad units found</p>
      ) : (
        <div className="space-y-4">
          {adUnits.map(ad => (
            <div 
              key={ad.id}
              className={`${editingAd?.id === ad.id ? 'border-redirector-primary' : ''}`}
            >
              {editingAd?.id === ad.id ? (
                <AdUnitEditor 
                  editingAd={editingAd} 
                  setEditingAd={setEditingAd} 
                  onSave={onSaveAd}
                  onCancel={() => setEditingAd(null)}
                />
              ) : (
                <AdUnitCard 
                  ad={ad} 
                  onToggleActive={onToggleActive}
                  onDelete={onDeleteAd}
                  onEdit={() => setEditingAd(ad)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
