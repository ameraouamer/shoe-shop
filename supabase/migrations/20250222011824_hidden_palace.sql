/*
  # Create admin user

  1. Changes
    - Creates admin user with specific credentials
    - Sets admin privileges in profiles table
    - Handles existing profiles to avoid duplicates
*/

DO $$ 
DECLARE 
  admin_user_id uuid;
BEGIN
  -- Create admin user if not exists
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud,
    confirmation_token
  )
  SELECT 
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    '@dminanzaro',
    crypt('@dminanzaro', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"firstName": "Admin", "lastName": "User"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    ''
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = '@dminanzaro'
  )
  RETURNING id INTO admin_user_id;

  -- If admin user was created and profile doesn't exist, create it
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, is_admin)
    SELECT 
      admin_user_id,
      '@dminanzaro',
      true
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = admin_user_id
    );
  END IF;

  -- Update any existing admin user's profile to ensure admin privileges
  UPDATE public.profiles
  SET is_admin = true
  WHERE email = '@dminanzaro'
  AND id IN (SELECT id FROM auth.users WHERE email = '@dminanzaro');
END $$;