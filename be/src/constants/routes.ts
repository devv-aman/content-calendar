export const ROUTES = {
  API_PREFIX: "/api",
  API_VERSION: "/v1",

  AUTH: {
    BASE: "/auth",
    LOGIN: "/login",
    REGISTER: "/register",
    GOOGLE: "/google",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    ME: "/me",
  },

  DOCS: {
    SWAGGER: "/api-docs",
    SWAGGER_JSON: "/swagger.json",
  },

  HEALTH: "/health",
} as const;

export const getFullPath = (basePath: string, subPath: string): string => {
  return `${ROUTES.API_PREFIX}${ROUTES.API_VERSION}${basePath}${subPath}`;
};
