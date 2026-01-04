export const AUTH_CONSTANTS = {
  SWAGGER_TAGS: ["Auth"],

  OPERATION_IDS: {
    LOGIN: "login",
    LOGOUT: "logout",
    REFRESH: "refreshToken",
    ME: "getCurrentUser",
  },

  SUMMARIES: {
    LOGIN: "User login",
    LOGOUT: "User logout",
    REFRESH: "Refresh access token",
    ME: "Get current user details",
  },

  DESCRIPTIONS: {
    LOGIN:
      "Authenticate user with email and password. Returns user data and sets HTTP-only cookies with tokens.",
    LOGOUT: "Logout user by clearing authentication cookies.",
    REFRESH: "Refresh the access token using the refresh token cookie.",
    ME: "Get the details of the currently authenticated user.",
  },
} as const;
