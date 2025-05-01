
import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AdUnit } from '@/utils/ads/types';

interface AdUnitFormProps {
  onSubmit: (adUnit: Omit<AdUnit, 'id' | 'active'>) => Promise<void>;
}

export const AdUnitForm: React.FC<AdUnitFormProps> = ({ onSubmit }) => {
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
      await onSubmit({
        name: newAdForm.name,
        position: newAdForm.position,
        code: newAdForm.code,
        priority: newAdForm.priority,
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

  return (
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
  );
};
