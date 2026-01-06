export const MESSAGES = {
  // Auth
  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    REGISTER_SUCCESS: "Registration successful",
    TOKEN_REFRESHED: "Token refreshed successfully",
    USER_FETCHED: "User details fetched successfully",
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_NOT_FOUND: "User not found",
    USER_ALREADY_EXISTS: "User with this email already exists",
    USER_DELETED: "User account has been deleted",
    UNAUTHORIZED: "Unauthorized access",
    TOKEN_EXPIRED: "Token has expired",
    TOKEN_INVALID: "Invalid token",
    REFRESH_TOKEN_REQUIRED: "Refresh token is required",
    ACCESS_TOKEN_REQUIRED: "Access token is required",
    GOOGLE_LOGIN_SUCCESS: "Google login successful",
    GOOGLE_TOKEN_INVALID: "Invalid Google token",
    GOOGLE_TOKEN_REQUIRED: "Google credential is required",
  },

  // Validation
  VALIDATION: {
    INVALID_EMAIL: "Invalid email format",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
    REQUIRED_FIELD: "This field is required",
    VALIDATION_FAILED: "Validation failed",
  },

  // Server
  SERVER: {
    STARTED: "Server started on port",
    INTERNAL_ERROR: "Internal server error",
    NOT_FOUND: "Resource not found",
    ROUTE_NOT_FOUND: "Route not found",
  },

  // Database
  DATABASE: {
    CONNECTION_ERROR: "Database connection error",
    QUERY_ERROR: "Database query error",
  },

  // Posts
  POSTS: {
    CREATED: "Post created successfully",
    UPDATED: "Post updated successfully",
    DELETED: "Post deleted successfully",
    FETCHED: "Post fetched successfully",
    LIST_FETCHED: "Posts fetched successfully",
    NOT_FOUND: "Post not found",
    FORBIDDEN: "You are not authorized to modify this post",
    FILE_UPLOAD_FAILED: "Failed to upload file",
    FILE_DELETE_FAILED: "Failed to delete file",
    INVALID_FILE_TYPE: "Invalid file type",
    FILE_TOO_LARGE: "File size exceeds the maximum allowed limit",
  },
} as const;
