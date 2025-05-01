
import { supabase } from '@/integrations/supabase/client';
import { AdUnit } from './types';

// Load ads from Supabase
export const loadAds = async (): Promise<AdUnit[]> => {
  try {
    console.log("Loading ad units from Supabase...");
    const { data, error } = await supabase
      .from('ad_units')
      .select('*');
    
    if (error) {
      console.error('Failed to load ads:', error);
      throw error;
    }
    
    console.log("Ad units loaded:", data?.length || 0);
    return data || [];
  } catch (e) {
    console.error('Failed to load ads:', e);
    return [];
  }
};

// Check if the table exists and create it if needed
export const ensureAdUnitsTableExists = async (): Promise<void> => {
  try {
    // Check if the ad_units table exists
    const { error: tableCheckError } = await supabase
      .from('ad_units')
      .select('count(*)', { count: 'exact', head: true });
    
    if (tableCheckError) {
      console.log("Table may not exist, attempting to create it");
      
      // Create the table if it doesn't exist (only run once)
      const { error: createTableError } = await supabase.rpc('create_ad_units_table_if_not_exists', {});
      if (createTableError) {
        console.error("Failed to create table:", createTableError);
        // Continue anyway, as the table might exist but with a different error
      }
    }
  } catch (e) {
    console.error('Error checking/creating table:', e);
  }
};

// Add a new ad unit
export const addAdUnit = async (adUnit: Omit<AdUnit, 'id'>): Promise<AdUnit | null> => {
  try {
    console.log("Adding new ad unit:", adUnit);
    
    // Ensure table exists
    await ensureAdUnitsTableExists();
    
    const newAdUnit = {
      ...adUnit,
      id: `ad-${Date.now()}`
    };
    
    const { data, error } = await supabase
      .from('ad_units')
      .insert([newAdUnit])
      .select();
    
    if (error) {
      console.error("Error inserting ad unit:", error);
      throw error;
    }
    
    console.log("Ad unit added successfully:", data);
    return data[0];
  } catch (e) {
    console.error('Failed to add ad unit:', e);
    throw e;
  }
};

// Update an ad unit
export const updateAdUnit = async (id: string, updates: Partial<AdUnit>): Promise<void> => {
  try {
    console.log("Updating ad unit:", id, updates);
    
    const { error } = await supabase
      .from('ad_units')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    
    console.log("Ad unit updated successfully");
  } catch (e) {
    console.error('Failed to update ad unit:', e);
    throw e;
  }
};

// Delete an ad unit
export const deleteAdUnit = async (id: string): Promise<void> => {
  try {
    console.log("Deleting ad unit:", id);
    
    const { error } = await supabase
      .from('ad_units')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    console.log("Ad unit deleted successfully");
  } catch (e) {
    console.error('Failed to delete ad unit:', e);
    throw e;
  }
};

// Reset to defaults (clear all ads)
export const resetToDefaults = async (): Promise<void> => {
  try {
    console.log("Resetting all ad units to default");
    
    const { error } = await supabase
      .from('ad_units')
      .delete()
      .neq('id', ''); // Delete all records
      
    if (error) throw error;
    
    console.log("All ad units reset successfully");
  } catch (e) {
    console.error('Failed to reset ads:', e);
    throw e;
  }
};
