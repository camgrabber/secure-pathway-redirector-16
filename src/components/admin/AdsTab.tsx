import React, { useState } from 'react';
import { Plus, RefreshCw, Eye, EyeOff, Save, Trash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAdManager, AdUnit } from '@/utils/adManager';

export const AdsTab = () => {
  const [editingAd, setEditingAd] = useState<AdUnit | null>(null);
  const [newAdForm, setNewAdForm] = useState<{
    name: string;
    position: string;
    code: string;
    priority?: 'high' | 'normal' | 'low';
  }>({
    name: '',
    position: 'top',
    code: '',
    priority: 'normal',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { 
    adUnits, 
    loading,
    addAdUnit, 
    updateAdUnit, 
    deleteAdUnit, 
    toggleAdActive, 
    resetToDefaults: resetAdsToDefaults
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

  const handleCreateAd = async () => {
    if (!newAdForm.name || !newAdForm.position || !newAdForm.code) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addAdUnit({
        name: newAdForm.name,
        position: newAdForm.position,
        code: newAdForm.code,
        priority: newAdForm.priority,
        active: true,
      });
      
      setNewAdForm({
        name: '',
        position: 'top',
        code: '',
        priority: 'normal',
      });
      
      toast({
        title: 'Ad Created',
        description: 'New ad unit has been created successfully',
      });
    } catch (error) {
      console.error('Error creating ad:', error);
      toast({
        title: 'Creation Failed',
        description: 'There was a problem creating this ad. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAdsToDefaults = async () => {
    if (window.confirm('Reset all ads to default settings? This cannot be undone.')) {
      try {
        setIsSubmitting(true);
        await resetAdsToDefaults();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-redirector-primary" />
        <p className="ml-2 text-lg">Loading ad units...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Current Ad Units</h2>
          <Button onClick={handleResetAdsToDefaults} variant="outline" size="sm">
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
                className={`border rounded-lg p-4 ${editingAd?.id === ad.id ? 'border-redirector-primary' : 'border-gray-200'}`}
              >
                {editingAd?.id === ad.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Ad Name</label>
                      <Input
                        value={editingAd.name}
                        onChange={e => setEditingAd({...editingAd, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Position</label>
                      <select 
                        value={editingAd.position}
                        onChange={e => setEditingAd({...editingAd, position: e.target.value})}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="top">Top</option>
                        <option value="middle">Middle</option>
                        <option value="bottom">Bottom</option>
                        <option value="after-timer">After Timer</option>
                        <option value="sticky">Sticky (Top of Page)</option>
                        <option value="interstitial">Interstitial (Full Screen)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Priority</label>
                      <select 
                        value={editingAd.priority || 'normal'}
                        onChange={e => setEditingAd({...editingAd, priority: e.target.value as 'high' | 'normal' | 'low'})}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="high">High (Load First)</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low (Load Last)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Ad Code</label>
                      <Textarea
                        value={editingAd.code}
                        onChange={e => setEditingAd({...editingAd, code: e.target.value})}
                        rows={5}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingAd(null)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveAd}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{ad.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Position: {ad.position}
                          </span>
                          {ad.priority && (
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Priority: {ad.priority}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleActive(ad.id)}
                          title={ad.active ? "Disable ad" : "Enable ad"}
                        >
                          {ad.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingAd(ad)}
                          title="Edit ad"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteAd(ad.id)}
                          title="Delete ad"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-auto max-h-24">
                      {ad.code.substring(0, 150)}...
                    </div>
                    <div className="mt-2 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ad.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Ad Unit</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Ad Name</label>
            <Input
              placeholder="Banner Ad Top"
              value={newAdForm.name}
              onChange={e => setNewAdForm({...newAdForm, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Position</label>
            <select 
              value={newAdForm.position}
              onChange={e => setNewAdForm({...newAdForm, position: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
              <option value="after-timer">After Timer</option>
              <option value="sticky">Sticky (Top of Page)</option>
              <option value="interstitial">Interstitial (Full Screen)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose where this ad will appear on the page
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Priority</label>
            <select 
              value={newAdForm.priority}
              onChange={e => setNewAdForm({...newAdForm, priority: e.target.value as 'high' | 'normal' | 'low'})}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="high">High (Load First)</option>
              <option value="normal">Normal</option>
              <option value="low">Low (Load Last)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              High priority ads load first and get better placement
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Ad Code</label>
            <Textarea
              placeholder="Paste ad code here..."
              value={newAdForm.code}
              onChange={e => setNewAdForm({...newAdForm, code: e.target.value})}
              rows={8}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the ad provider's JavaScript code here
            </p>
          </div>
          
          <Button 
            onClick={handleCreateAd}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create New Ad Unit
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
