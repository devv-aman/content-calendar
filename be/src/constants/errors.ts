export const ERROR_CODES = {
  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_NAMES = {
  VALIDATION_ERROR: "ValidationError",
  AUTHENTICATION_ERROR: "AuthenticationError",
  AUTHORIZATION_ERROR: "AuthorizationError",
  NOT_FOUND_ERROR: "NotFoundError",
  CONFLICT_ERROR: "ConflictError",
  INTERNAL_ERROR: "InternalError",
  DATABASE_ERROR: "DatabaseError",
} as const;
