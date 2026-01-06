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
    SCHEDULED_TIME: "Scheduled Time",
    STATUS: "Status",
    CONTENT: "Content",
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
