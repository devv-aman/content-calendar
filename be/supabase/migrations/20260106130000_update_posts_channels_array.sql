-- Migration: Update posts table to support multiple channels
-- Description: Changes the channel column from VARCHAR to TEXT[] array

-- Drop the existing check constraint
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_channel_check;

-- Change column type from VARCHAR to TEXT array
ALTER TABLE posts 
  ALTER COLUMN channel TYPE TEXT[] 
  USING ARRAY[channel]::TEXT[];

-- Add a new check constraint for array values
ALTER TABLE posts 
  ADD CONSTRAINT posts_channels_check 
  CHECK (channel <@ ARRAY['twitter', 'facebook', 'instagram', 'youtube', 'linkedin']::TEXT[]);

-- Add constraint to ensure at least one channel
ALTER TABLE posts
  ADD CONSTRAINT posts_channels_not_empty
  CHECK (array_length(channel, 1) > 0);

-- Update the index for channel queries (using GIN for array containment)
DROP INDEX IF EXISTS idx_posts_channel;
CREATE INDEX idx_posts_channels ON posts USING GIN(channel);

COMMENT ON COLUMN posts.channel IS 'Array of social media channels: twitter, facebook, instagram, youtube, linkedin';

