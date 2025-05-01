
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdManager, AdUnit } from '@/utils/adManager';
import { AdUnitForm } from './ads/AdUnitForm';
import { AdUnitsList } from './ads/AdUnitsList';

export const AdsTab = () => {
  const [editingAd, setEditingAd] = useState<AdUnit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { 
    adUnits, 
    loading,
    addAdUnit, 
    updateAdUnit, 
    deleteAdUnit, 
    toggleAdActive, 
    resetToDefaults
  } = useAdManager();

  const handleSaveAd = async () => {
    if (!editingAd) return;
    
    try {
      setIsSubmitting(true);
      await updateAdUnit(editingAd.id, editingAd);
      setEditingAd(null);
      toast({
        title: 'Ad Updated',
        description: 'Ad unit has been saved successfully',
      });
    } catch (error) {
      console.error('Error saving ad:', error);
      toast({
        title: 'Update Failed',
        description: 'There was a problem updating this ad. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAd = async (adUnit: Omit<AdUnit, 'id' | 'active'>) => {
    try {
      await addAdUnit({
        ...adUnit,
        active: true,
      });
      
      toast({
        title: 'Ad Created',
        description: 'New ad unit has been created successfully',
      });
    } catch (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
  };

  const handleResetAdsToDefaults = async () => {
    if (window.confirm('Reset all ads to default settings? This cannot be undone.')) {
      try {
        setIsSubmitting(true);
        await resetToDefaults();
        toast({
          title: 'Reset Complete',
          description: 'Ad units have been reset to defaults',
        });
      } catch (error) {
        console.error('Error resetting ads:', error);
        toast({
          title: 'Reset Failed',
          description: 'There was a problem resetting ads. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleToggleActive = async (id: string) => {
    try {
      await toggleAdActive(id);
    } catch (error) {
      console.error('Error toggling ad state:', error);
      toast({
        title: 'Status Change Failed',
        description: 'There was a problem changing the ad status',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteAd = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await deleteAdUnit(id);
        toast({
          title: 'Ad Deleted',
          description: 'Ad unit has been removed',
        });
      } catch (error) {
        console.error('Error deleting ad:', error);
        toast({
          title: 'Deletion Failed',
          description: 'There was a problem deleting this ad',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
        <AdUnitsList
          adUnits={adUnits}
          loading={loading}
          editingAd={editingAd}
          setEditingAd={setEditingAd}
          onSaveAd={handleSaveAd}
          onToggleActive={handleToggleActive}
          onDeleteAd={handleDeleteAd}
          onResetToDefaults={handleResetAdsToDefaults}
        />
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Ad Unit</h2>
        <AdUnitForm onSubmit={handleCreateAd} />
      </div>
    </div>
  );
};
