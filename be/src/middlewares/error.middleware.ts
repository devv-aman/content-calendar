import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";
import { sendError } from "../utils/response.js";
import { ERROR_CODES } from "../constants/errors.js";
import { MESSAGES } from "../constants/messages.js";
import { logger } from "./logger.middleware.js";
import { env } from "../config/env.js";

interface ErrorWithStatus extends Error {
  statusCode?: number;
  status?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    sendError(
      res,
      ERROR_CODES.UNPROCESSABLE_ENTITY,
      MESSAGES.VALIDATION.VALIDATION_FAILED,
      errors
    );
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    sendError(
      res,
      err.statusCode,
      err.message,
      env.NODE_ENV === "development" ? err.stack : undefined
    );
    return;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    sendError(res, ERROR_CODES.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_INVALID);
    return;
  }

  if (err.name === "TokenExpiredError") {
    sendError(res, ERROR_CODES.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_EXPIRED);
    return;
  }

  // Default to internal server error
  const statusCode =
    err.statusCode || err.status || ERROR_CODES.INTERNAL_SERVER_ERROR;
  const message =
    env.NODE_ENV === "production"
      ? MESSAGES.SERVER.INTERNAL_ERROR
      : err.message || MESSAGES.SERVER.INTERNAL_ERROR;

  sendError(
    res,
    statusCode,
    message,
    env.NODE_ENV === "development" ? err.stack : undefined
  );
};

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(res, ERROR_CODES.NOT_FOUND, MESSAGES.SERVER.ROUTE_NOT_FOUND);
};
