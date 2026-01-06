export const DATABASE = {
  TABLES: {
    USERS: "users",
    POSTS: "posts",
  },

  COLUMNS: {
    USERS: {
      ID: "id",
      NAME: "name",
      EMAIL: "email",
      PASSWORD: "password",
      ROLE: "role",
      GOOGLE_ID: "google_id",
      AVATAR_URL: "avatar_url",
      CREATED_AT: "created_at",
      UPDATED_AT: "updated_at",
      DELETED_AT: "deleted_at",
    },
    POSTS: {
      ID: "id",
      USER_ID: "user_id",
      TITLE: "title",
      CONTENT: "content",
      CHANNEL: "channel",
      SCHEDULED_TIME: "scheduled_time",
      FILE_URL: "file_url",
      FILE_NAME: "file_name",
      FILE_TYPE: "file_type",
      CREATED_AT: "created_at",
      UPDATED_AT: "updated_at",
      DELETED_AT: "deleted_at",
    },
  },

  STORAGE: {
    BUCKETS: {
      ATTACHMENTS: "content-calendar-attachments",
    },
    PATHS: {
      POSTS: "users/{userId}/posts/{postId}",
    },
  },
} as const;
