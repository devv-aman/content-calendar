-- Migration: Create posts table
-- Description: Creates the posts table for content calendar posts management

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    channel VARCHAR(50) NOT NULL CHECK (channel IN ('twitter', 'facebook', 'instagram', 'youtube', 'linkedin')),
    scheduled_time TIMESTAMPTZ NOT NULL,
    file_url TEXT,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_channel ON posts(channel);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_time ON posts(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON posts(deleted_at);

-- Create composite index for date range queries
CREATE INDEX IF NOT EXISTS idx_posts_user_scheduled ON posts(user_id, scheduled_time) WHERE deleted_at IS NULL;

-- Apply the same updated_at trigger from users table
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Disable Row Level Security since we're using custom JWT auth
-- All access is controlled at the application level via the backend
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE posts IS 'Content calendar posts for scheduling social media content';
COMMENT ON COLUMN posts.id IS 'Unique identifier for the post';
COMMENT ON COLUMN posts.user_id IS 'Reference to the user who created the post';
COMMENT ON COLUMN posts.title IS 'Title of the post';
COMMENT ON COLUMN posts.content IS 'Content/body of the post';
COMMENT ON COLUMN posts.channel IS 'Social media channel: twitter, facebook, instagram, youtube, linkedin';
COMMENT ON COLUMN posts.scheduled_time IS 'Scheduled date and time for the post';
COMMENT ON COLUMN posts.file_url IS 'URL of the attached file in Supabase Storage';
COMMENT ON COLUMN posts.file_name IS 'Original filename of the attachment';
COMMENT ON COLUMN posts.file_type IS 'MIME type of the attachment';
COMMENT ON COLUMN posts.created_at IS 'Timestamp when the post was created';
COMMENT ON COLUMN posts.updated_at IS 'Timestamp when the post was last updated';
COMMENT ON COLUMN posts.deleted_at IS 'Timestamp for soft delete, null if active';

