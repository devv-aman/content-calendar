export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "twitter"
  | "youtube"
  | "linkedin";

export type PostStatus = "scheduled" | "published" | "draft";

export interface ScheduledPost {
  id: string;
  platform: SocialPlatform;
  scheduledTime: Date;
  title: string;
  content: string;
  status: PostStatus;
  mediaUrl?: string;
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
  channel: SocialPlatform | "all";
  viewMode: ViewMode;
  dateRange: DateRange;
}
