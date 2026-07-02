-- Migration script for Supabase Auth Integration

-- 1. Make password_hash nullable because Supabase GoTrue handles passwords now.
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Add an auth_id column to map to Supabase auth.users UUID.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;

-- 3. Create a trigger function to automatically insert new Supabase users into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- We assume the frontend passes user metadata (name, role, phone) in raw_user_meta_data
  INSERT INTO public.users (auth_id, name, email, role, phone, is_approved)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Unknown'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'parent'),
    new.raw_user_meta_data->>'phone',
    CASE WHEN (new.raw_user_meta_data->>'role' = 'admin') THEN true ELSE false END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Important: Since we aren't migrating existing users, existing users in `public.users` won't have an `auth_id`.
-- You may want to truncate the users table (and dependent tables) if this is a fresh start, 
-- or leave them if they are test data.
