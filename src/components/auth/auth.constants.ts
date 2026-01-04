export const AUTH_STRINGS = {
  // Mode toggle
  LOGIN_TITLE: "Welcome Back",
  LOGIN_SUBTITLE: "Sign in to continue to your dashboard",
  REGISTER_TITLE: "Create Account",
  REGISTER_SUBTITLE: "Get started with your content calendar",

  // Form labels
  NAME_LABEL: "Full Name",
  NAME_PLACEHOLDER: "Enter your full name",
  EMAIL_LABEL: "Email",
  EMAIL_PLACEHOLDER: "Enter your email",
  PASSWORD_LABEL: "Password",
  PASSWORD_PLACEHOLDER: "Enter your password",
  CONFIRM_PASSWORD_LABEL: "Confirm Password",
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm your password",

  // Buttons
  LOGIN_BUTTON: "Sign In",
  REGISTER_BUTTON: "Create Account",
  GOOGLE_BUTTON: "Continue with Google",
  LOADING_TEXT: "Please wait...",

  // Toggle text
  NO_ACCOUNT: "Don't have an account?",
  HAS_ACCOUNT: "Already have an account?",
  SIGN_UP_LINK: "Sign up",
  SIGN_IN_LINK: "Sign in",

  // Divider
  OR_DIVIDER: "or",

  // Validation errors
  ERRORS: {
    NAME_REQUIRED: "Name is required",
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Please enter a valid email",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
    PASSWORDS_NOT_MATCH: "Passwords do not match",
  },

  // API error messages
  API_ERRORS: {
    GENERIC: "Something went wrong. Please try again.",
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_EXISTS: "An account with this email already exists",
  },
} as const;
