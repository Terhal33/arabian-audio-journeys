
-- Fix RLS policies for user_profiles table
-- Allow users to insert their own profiles
CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Fix RLS policies for user_roles table  
-- Allow inserting user roles (needed for the trigger function)
CREATE POLICY "Allow user role creation" ON public.user_roles
FOR INSERT 
WITH CHECK (true);

-- Create triggers to automatically create profiles and roles on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE TRIGGER on_auth_user_role_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
