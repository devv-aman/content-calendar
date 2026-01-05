-- Migration: Add Google OAuth columns to users table
-- Description: Makes password nullable and adds google_id and avatar_url columns for Google Sign-in

-- Make password column nullable for Google OAuth users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Add google_id column to store Google's unique user identifier (sub claim)
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- Add avatar_url column to store Google profile picture
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index on google_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

COMMENT ON COLUMN users.password IS 'Bcrypt hashed password (nullable for Google OAuth users)';
COMMENT ON COLUMN users.google_id IS 'Google OAuth unique user identifier (sub claim)';
COMMENT ON COLUMN users.avatar_url IS 'User profile picture URL (from Google or uploaded)';

