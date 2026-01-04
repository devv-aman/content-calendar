export const APP_STRINGS = {
  APP_NAME: "Content Calendar",

  // Navigation
  NAV: {
    HOME: "Home",
    DASHBOARD: "Dashboard",
    LOGIN: "Login",
  },

  // Pages
  PAGES: {
    HOME: {
      TITLE: "Home",
      HERO_TITLE: "Plan Your Content,",
      HERO_TITLE_HIGHLIGHT: "Amplify Your Reach",
      HERO_SUBTITLE:
        "Streamline your content workflow with our intuitive calendar. Schedule, organize, and track all your content in one powerful platform.",
      CTA_BUTTON: "Get Started",
    },
    DASHBOARD: {
      TITLE: "Dashboard",
      WELCOME_MESSAGE: "Welcome back, {name}!",
    },
    AUTH: {
      TITLE: "Sign In",
    },
    NOT_FOUND: {
      CODE: "404",
      TITLE: "Page Not Found",
      DESCRIPTION: "The page you are looking for does not exist.",
    },
  },

  // Sidebar
  SIDEBAR: {
    TOGGLE_LABEL: "Toggle sidebar",
    EXPAND_LABEL: "Expand sidebar",
    COLLAPSE_LABEL: "Collapse sidebar",
  },

  // Theme
  THEME: {
    LIGHT: "light",
    DARK: "dark",
    TOGGLE_LABEL: "Toggle theme",
  },

  // User
  USER: {
    DEFAULT_NAME: "User",
    AVATAR_SEED: "content-calendar-user",
    LOGOUT: "Logout",
  },
} as const;
