export const APP_STRINGS = {
  APP_NAME: "Content Calendar",

  // Navigation
  NAV: {
    HOME: "Home",
    SCHEDULE: "Schedule",
  },

  // Pages
  PAGES: {
    HOME: {
      TITLE: "Home",
      GREETING: "Hello World",
    },
    SCHEDULE: {
      TITLE: "Schedule",
      CONTENT: "Schedule",
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
  },
} as const;
