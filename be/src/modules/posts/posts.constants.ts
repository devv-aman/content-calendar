export const POSTS_CONSTANTS = {
  CHANNELS: [
    "twitter",
    "facebook",
    "instagram",
    "youtube",
    "linkedin",
  ] as const,

  FILE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_MIME_TYPES: [
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Spreadsheets
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // Videos
      "video/mp4",
      "video/quicktime",
    ] as const,
    ALLOWED_EXTENSIONS: [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".mp4",
      ".mov",
    ] as const,
  },

  VALIDATION: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 255,
    CONTENT_MIN_LENGTH: 1,
    CONTENT_MAX_LENGTH: 10000,
  },

  DATE_FORMAT: {
    SCHEDULED_TIME: "YYYY-MM-DD HH:MM:SS",
    DATE_ONLY: "YYYY-MM-DD",
  },
} as const;

export type Channel = (typeof POSTS_CONSTANTS.CHANNELS)[number];
export type AllowedMimeType =
  (typeof POSTS_CONSTANTS.FILE.ALLOWED_MIME_TYPES)[number];
