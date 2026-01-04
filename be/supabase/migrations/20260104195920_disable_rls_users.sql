-- Migration: Disable RLS on users table
-- Since we're using custom JWT auth (not Supabase Auth), 
-- all access control is handled at the application level

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies (if any were created)
DROP POLICY IF EXISTS "Users can view own data" ON users;
