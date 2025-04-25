
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Save,
  Trash,
  Plus,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useAdManager, AdUnit } from '../utils/adManager';

// Admin page password - in a real app, use proper authentication
const ADMIN_PASSWORD = "admin123";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [editingAd, setEditingAd] = useState<AdUnit | null>(null);
  const [newAdForm, setNewAdForm] = useState<{
    name: string;
    position: string;
    code: string;
  }>({
    name: '',
    position: 'top',
    code: '',
  });
  
  const { toast } = useToast();
  const { 
    adUnits, 
    addAdUnit, 
    updateAdUnit, 
    deleteAdUnit, 
    toggleAdActive, 
    resetToDefaults 
  } = useAdManager();
  
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      toast({
        title: 'Authentication Failed',
        description: 'Incorrect password',
        variant: 'destructive',
      });
    }
  };
  
  const handleSaveAd = () => {
    if (!editingAd) return;
    
    updateAdUnit(editingAd.id, editingAd);
    setEditingAd(null);
    toast({
      title: 'Ad Updated',
      description: 'Ad unit has been saved successfully',
    });
  };
  
  const handleCreateAd = () => {
    if (!newAdForm.name || !newAdForm.position || !newAdForm.code) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    addAdUnit({
      name: newAdForm.name,
      position: newAdForm.position,
      code: newAdForm.code,
      active: true,
    });
    
    setNewAdForm({
      name: '',
      position: 'top',
      code: '',
    });
    
    toast({
      title: 'Ad Created',
      description: 'New ad unit has been created successfully',
    });
  };
  
  const handleResetToDefaults = () => {
    if (window.confirm('Reset all ads to default settings? This cannot be undone.')) {
      resetToDefaults();
      toast({
        title: 'Reset Complete',
        description: 'Ad units have been reset to defaults',
      });
    }
  };
  
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-redirector-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-redirector-primary" />
            </div>
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter password to access ad management</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Input 
                type="password" 
                placeholder="Enter admin password" 
                value={passwordInput} 
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full"
            >
              Login
            </Button>
            
            <div className="text-center pt-4">
              <Link to="/" className="text-redirector-primary hover:underline text-sm">
                <ArrowLeft className="inline h-4 w-4 mr-1" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-redirector-dark mb-2">Ad Manager</h1>
              <p className="text-gray-600">Manage all ad units across your redirection service</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button onClick={handleResetToDefaults} variant="outline">Reset to Defaults</Button>
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Exit Admin
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Ads List */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Current Ad Units</h2>
            
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
                            <option value="after-timer">After Timer</option>
                            <option value="bottom">Bottom</option>
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
                            <p className="text-sm text-gray-500">Position: {ad.position}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleAdActive(ad.id)}
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
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this ad?')) {
                                  deleteAdUnit(ad.id);
                                  toast({
                                    title: 'Ad Deleted',
                                    description: 'Ad unit has been removed',
                                  });
                                }
                              }}
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
          
          {/* Add New Ad Form */}
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
                  <option value="after-timer">After Timer</option>
                  <option value="bottom">Bottom</option>
                </select>
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
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Ad Unit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
