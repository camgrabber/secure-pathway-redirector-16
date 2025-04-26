
-- Create a stored procedure for updating app settings
CREATE OR REPLACE FUNCTION update_app_settings(
  settings_id TEXT,
  settings_updates JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_settings JSONB;
  updated_settings JSONB;
  result JSONB;
BEGIN
  -- Get current settings
  SELECT setting_value::jsonb INTO current_settings
  FROM app_settings
  WHERE id = settings_id;
  
  -- If no settings found, return error
  IF current_settings IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Settings not found');
  END IF;
  
  -- Merge updates with current settings
  updated_settings = current_settings || settings_updates;
  
  -- Update the settings
  UPDATE app_settings
  SET 
    setting_value = updated_settings,
    updated_at = NOW()
  WHERE id = settings_id;
  
  -- Return success
  RETURN jsonb_build_object('success', true, 'settings', updated_settings);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
