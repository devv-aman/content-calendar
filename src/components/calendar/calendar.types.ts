// Channel types - matches backend
export type PostChannel =
  | "instagram"
  | "facebook"
  | "twitter"
  | "youtube"
  | "linkedin";

// Alias for UI components that use "platform" terminology
export type SocialPlatform = PostChannel;

export type PostStatus = "scheduled" | "published" | "draft";

// API response type - matches backend exactly
export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  channel: PostChannel[];
  scheduled_time: string; // ISO 8601 format
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}

// UI display type - transformed from API response
export interface ScheduledPost {
  id: string;
  channels: PostChannel[];
  scheduledTime: Date;
  title: string;
  content: string;
  status: PostStatus;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

// Form input for creating a post
export interface CreatePostInput {
  title: string;
  content: string;
  channel: string; // Comma-separated channels for form-data
  scheduled_time: string; // ISO 8601 format
  file?: File;
}

// Form input for updating a post (all fields optional)
export interface UpdatePostInput {
  title?: string;
  content?: string;
  channel?: string; // Comma-separated channels for form-data
  scheduled_time?: string;
  file?: File;
}

// Query parameters for fetching posts
export interface PostsQueryParams {
  channel?: PostChannel;
  start_date?: string; // Format: "YYYY-MM-DD"
  end_date?: string; // Format: "YYYY-MM-DD"
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: ScheduledPost[];
}

export type ViewMode = "week" | "month";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface CalendarFilters {
  channel: PostChannel | "all";
  viewMode: ViewMode;
  dateRange: DateRange;
}

// Drawer mode for create/edit
export type DrawerMode = "create" | "edit";
