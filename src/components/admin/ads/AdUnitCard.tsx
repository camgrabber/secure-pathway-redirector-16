
import React from 'react';
import { Eye, EyeOff, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdUnit } from '@/utils/ads/types';

interface AdUnitCardProps {
  ad: AdUnit;
  onToggleActive: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (ad: AdUnit) => void;
}

export const AdUnitCard: React.FC<AdUnitCardProps> = ({ 
  ad, 
  onToggleActive, 
  onDelete, 
  onEdit 
}) => {
  return (
    <div className="border rounded-lg p-4 border-gray-200">
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
            onClick={() => onToggleActive(ad.id)}
            title={ad.active ? "Disable ad" : "Enable ad"}
          >
            {ad.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(ad)}
            title="Edit ad"
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(ad.id)}
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
  );
};
