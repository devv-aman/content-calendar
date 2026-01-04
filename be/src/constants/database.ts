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
      CREATED_AT: "created_at",
      UPDATED_AT: "updated_at",
      DELETED_AT: "deleted_at",
    },
  },
} as const;
