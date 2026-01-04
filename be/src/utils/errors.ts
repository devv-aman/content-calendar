import { ERROR_CODES, ERROR_NAMES } from "../constants/errors.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = ERROR_CODES.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = ERROR_NAMES.INTERNAL_ERROR;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, ERROR_CODES.UNPROCESSABLE_ENTITY);
    this.name = ERROR_NAMES.VALIDATION_ERROR;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, ERROR_CODES.UNAUTHORIZED);
    this.name = ERROR_NAMES.AUTHENTICATION_ERROR;
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, ERROR_CODES.FORBIDDEN);
    this.name = ERROR_NAMES.AUTHORIZATION_ERROR;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, ERROR_CODES.NOT_FOUND);
    this.name = ERROR_NAMES.NOT_FOUND_ERROR;
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, ERROR_CODES.CONFLICT);
    this.name = ERROR_NAMES.CONFLICT_ERROR;
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, ERROR_CODES.INTERNAL_SERVER_ERROR, false);
    this.name = ERROR_NAMES.DATABASE_ERROR;
  }
}
