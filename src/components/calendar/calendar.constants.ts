import {
  SiInstagram,
  SiFacebook,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import type { ComponentType, SVGProps } from "react";
import type { SocialPlatform } from "./calendar.types";
import { LinkedInIcon } from "./icons";

export const CALENDAR_STRINGS = {
  HEADER: {
    CHANNEL_LABEL: "Channel",
    CHANNEL_ALL: "All Channels",
    VIEW_WEEK: "Week",
    VIEW_MONTH: "Month",
    DATE_RANGE_LABEL: "Date Range",
    ADD_NEW: "Add New",
  },
  GRID: {
    DAYS: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    DAYS_SHORT: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    PUBLICATION: "Publication",
    PUBLICATIONS: "Publications",
  },
  SIDEBAR: {
    TITLE: "Post Details",
    PLATFORM: "Platform",
    PLATFORMS: "Platforms",
    SCHEDULED_TIME: "Scheduled Time",
    STATUS: "Status",
    CONTENT: "Content",
    ATTACHMENT: "Attachment",
    ACTIONS: {
      EDIT: "Edit",
      DELETE: "Delete",
      RESCHEDULE: "Reschedule",
    },
  },
  STATUS: {
    SCHEDULED: "Scheduled",
    PUBLISHED: "Published",
    DRAFT: "Draft",
  },
  MONTHS: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  DRAWER: {
    CREATE_TITLE: "Create New Post",
    EDIT_TITLE: "Edit Post",
    TITLE_LABEL: "Title",
    TITLE_PLACEHOLDER: "Enter post title",
    CONTENT_LABEL: "Content",
    CONTENT_PLACEHOLDER: "Write your post content...",
    CHANNELS_LABEL: "Channels",
    CHANNELS_HINT: "Select at least one channel",
    SCHEDULED_DATE_LABEL: "Scheduled Date",
    SCHEDULED_TIME_LABEL: "Scheduled Time",
    FILE_LABEL: "Attachment",
    FILE_HINT: "Max 10MB (images, documents, videos)",
    FILE_REMOVE: "Remove",
    SUBMIT_CREATE: "Create Post",
    SUBMIT_UPDATE: "Save Changes",
    CANCEL: "Cancel",
    SUBMITTING: "Saving...",
    VALIDATION: {
      TITLE_REQUIRED: "Title is required",
      CONTENT_REQUIRED: "Content is required",
      CHANNEL_REQUIRED: "Select at least one channel",
      DATE_REQUIRED: "Scheduled date is required",
      TIME_REQUIRED: "Scheduled time is required",
    },
  },
  DELETE_DIALOG: {
    TITLE: "Delete Post",
    DESCRIPTION:
      "Are you sure you want to delete this post? This action cannot be undone.",
    CANCEL: "Cancel",
    CONFIRM: "Delete",
    DELETING: "Deleting...",
  },
  LOADING: {
    POSTS: "Loading posts...",
  },
  ERROR: {
    FETCH_FAILED: "Failed to load posts",
    CREATE_FAILED: "Failed to create post",
    UPDATE_FAILED: "Failed to update post",
    DELETE_FAILED: "Failed to delete post",
    RETRY: "Retry",
  },
  EMPTY: {
    TITLE: "No posts scheduled",
    DESCRIPTION: "Click 'Add New' to create your first post",
  },
} as const;

export type SocialIconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string }
>;

export interface PlatformConfig {
  id: SocialPlatform;
  label: string;
  icon: SocialIconComponent;
  colorVar: string;
  bgColorVar: string;
}

export const PLATFORM_CONFIG: Record<SocialPlatform, PlatformConfig> = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    icon: SiInstagram,
    colorVar: "--platform-instagram",
    bgColorVar: "--platform-instagram-bg",
  },
  facebook: {
    id: "facebook",
    label: "Facebook",
    icon: SiFacebook,
    colorVar: "--platform-facebook",
    bgColorVar: "--platform-facebook-bg",
  },
  twitter: {
    id: "twitter",
    label: "X (Twitter)",
    icon: SiX,
    colorVar: "--platform-twitter",
    bgColorVar: "--platform-twitter-bg",
  },
  youtube: {
    id: "youtube",
    label: "YouTube",
    icon: SiYoutube,
    colorVar: "--platform-youtube",
    bgColorVar: "--platform-youtube-bg",
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    icon: LinkedInIcon,
    colorVar: "--platform-linkedin",
    bgColorVar: "--platform-linkedin-bg",
  },
} as const;

export const ALL_PLATFORMS: SocialPlatform[] = [
  "instagram",
  "facebook",
  "twitter",
  "youtube",
  "linkedin",
];
