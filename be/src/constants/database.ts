export const DATABASE = {
  TABLES: {
    USERS: "users",
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
  },
} as const;
