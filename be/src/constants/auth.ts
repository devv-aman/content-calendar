export const AUTH = {
  COOKIE_NAMES: {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
  },

  ROLES: {
    USER: "user",
    ADMIN: "admin",
  },

  PASSWORD: {
    MIN_LENGTH: 8,
    SALT_ROUNDS: 12,
  },

  TOKEN_TYPES: {
    ACCESS: "access",
    REFRESH: "refresh",
  },
} as const;

export type UserRole = (typeof AUTH.ROLES)[keyof typeof AUTH.ROLES];
