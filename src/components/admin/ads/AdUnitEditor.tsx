
import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdUnit } from '@/utils/ads/types';

interface AdUnitEditorProps {
  editingAd: AdUnit;
  setEditingAd: React.Dispatch<React.SetStateAction<AdUnit | null>>;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export const AdUnitEditor: React.FC<AdUnitEditorProps> = ({ 
  editingAd, 
  setEditingAd, 
  onSave,
  onCancel
}) => {
  return (
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
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
