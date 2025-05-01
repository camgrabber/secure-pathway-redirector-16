
-- Create a function to create the ad_units table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_ad_units_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'ad_units'
  ) THEN
    -- Create the table if it doesn't exist
    CREATE TABLE public.ad_units (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      code TEXT NOT NULL,
      active BOOLEAN DEFAULT true,
      priority TEXT,
      view_threshold INTEGER,
      frequency INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add RLS policies
    ALTER TABLE public.ad_units ENABLE ROW LEVEL SECURITY;
    
    -- Allow all operations for authenticated users
    CREATE POLICY "Enable all operations for authenticated users" 
      ON public.ad_units
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END;
$$;
