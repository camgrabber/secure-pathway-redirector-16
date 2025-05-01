
import { supabase } from '@/integrations/supabase/client';
import { AdUnit } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetches all ad units from the database
 */
export const fetchAllAdUnits = async (): Promise<AdUnit[]> => {
  try {
    const { data, error } = await supabase
      .from('ad_units')
      .select('*')
      .order('position');
      
    if (error) {
      console.error('Error fetching ad units:', error);
      throw error;
    }
    
    // Properly cast the data to AdUnit type, ensuring priority is handled correctly
    return (data || []) as AdUnit[];
  } catch (error) {
    console.error('Error in fetchAllAdUnits:', error);
    return [];
  }
};

/**
 * Fetches active ads units by position
 */
export const fetchAdsByPosition = async (position: string): Promise<AdUnit[]> => {
  try {
    const { data, error } = await supabase
      .from('ad_units')
      .select('*')
      .eq('position', position)
      .eq('active', true);
      
    if (error) {
      console.error(`Error fetching ads for position ${position}:`, error);
      throw error;
    }
    
    return (data || []) as AdUnit[];
  } catch (error) {
    console.error('Error in fetchAdsByPosition:', error);
    return [];
  }
};

/**
 * Creates a new ad unit in the database
 */
export const createAdUnit = async (adUnit: Omit<AdUnit, 'id'>): Promise<AdUnit | null> => {
  try {
    // Generate a random ID for the ad unit to fix the issue with missing id
    const adUnitWithId = { 
      ...adUnit, 
      id: uuidv4(),  // Generate UUID for new ad unit
    };
    
    const { data, error } = await supabase
      .from('ad_units')
      .insert(adUnitWithId)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating ad unit:', error);
      throw error;
    }
    
    return data as AdUnit;
  } catch (error) {
    console.error('Error in createAdUnit:', error);
    return null;
  }
};

/**
 * Updates an existing ad unit in the database
 */
export const updateAdUnit = async (id: string, adUnit: Partial<AdUnit>): Promise<AdUnit | null> => {
  try {
    const { data, error } = await supabase
      .from('ad_units')
      .update(adUnit)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating ad unit ${id}:`, error);
      throw error;
    }
    
    return data as AdUnit;
  } catch (error) {
    console.error('Error in updateAdUnit:', error);
    return null;
  }
};

/**
 * Removes an ad unit from the database
 */
export const deleteAdUnit = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ad_units')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting ad unit ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteAdUnit:', error);
    return false;
  }
};

/**
 * Toggles the active status of an ad unit
 */
export const toggleAdActive = async (id: string): Promise<AdUnit | null> => {
  try {
    // First get the current state
    const { data: currentData, error: fetchError } = await supabase
      .from('ad_units')
      .select('active')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error(`Error fetching ad unit ${id}:`, fetchError);
      throw fetchError;
    }
    
    // Toggle the active state
    const { data, error } = await supabase
      .from('ad_units')
      .update({ active: !currentData.active })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error toggling ad unit ${id}:`, error);
      throw error;
    }
    
    return data as AdUnit;
  } catch (error) {
    console.error('Error in toggleAdActive:', error);
    return null;
  }
};
