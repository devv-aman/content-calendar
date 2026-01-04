import { Request, Response, NextFunction } from "express";
import { AUTH } from "../constants/auth.js";
import { MESSAGES } from "../constants/messages.js";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import { AuthenticationError } from "../utils/errors.js";
import type { JwtPayload } from "../types/index.js";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const accessToken = req.cookies[AUTH.COOKIE_NAMES.ACCESS_TOKEN] as
      | string
      | undefined;

    if (!accessToken) {
      throw new AuthenticationError(MESSAGES.AUTH.ACCESS_TOKEN_REQUIRED);
    }

    const decoded = verifyAccessToken(accessToken);

    if (decoded.type !== AUTH.TOKEN_TYPES.ACCESS) {
      throw new AuthenticationError(MESSAGES.AUTH.TOKEN_INVALID);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
      return;
    }

    const err = error as Error;
    if (err.name === "TokenExpiredError") {
      next(new AuthenticationError(MESSAGES.AUTH.TOKEN_EXPIRED));
      return;
    }

    next(new AuthenticationError(MESSAGES.AUTH.TOKEN_INVALID));
  }
};

export const authenticateRefreshToken = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const refreshToken = req.cookies[AUTH.COOKIE_NAMES.REFRESH_TOKEN] as
      | string
      | undefined;

    if (!refreshToken) {
      throw new AuthenticationError(MESSAGES.AUTH.REFRESH_TOKEN_REQUIRED);
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (decoded.type !== AUTH.TOKEN_TYPES.REFRESH) {
      throw new AuthenticationError(MESSAGES.AUTH.TOKEN_INVALID);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
      return;
    }

    const err = error as Error;
    if (err.name === "TokenExpiredError") {
      next(new AuthenticationError(MESSAGES.AUTH.TOKEN_EXPIRED));
      return;
    }

    next(new AuthenticationError(MESSAGES.AUTH.TOKEN_INVALID));
  }
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const accessToken = req.cookies[AUTH.COOKIE_NAMES.ACCESS_TOKEN] as
      | string
      | undefined;

    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      if (decoded.type === AUTH.TOKEN_TYPES.ACCESS) {
        req.user = decoded;
      }
    }

    next();
  } catch {
    // Token invalid or expired, continue without user
    next();
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user as JwtPayload | undefined;

    if (!user) {
      next(new AuthenticationError(MESSAGES.AUTH.UNAUTHORIZED));
      return;
    }

    if (!roles.includes(user.role)) {
      next(new AuthenticationError(MESSAGES.AUTH.UNAUTHORIZED));
      return;
    }

    next();
  };
};
