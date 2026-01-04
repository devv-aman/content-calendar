import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AUTH } from "../constants/auth.js";
import type { JwtPayload, TokenPair } from "../types/index.js";

const parseExpiryToMs = (expiry: string): number => {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiry format: ${expiry}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
};

export const generateAccessToken = (
  payload: Omit<JwtPayload, "type" | "iat" | "exp">
): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(
    { ...payload, type: AUTH.TOKEN_TYPES.ACCESS },
    env.JWT_ACCESS_SECRET,
    options
  );
};

export const generateRefreshToken = (
  payload: Omit<JwtPayload, "type" | "iat" | "exp">
): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(
    { ...payload, type: AUTH.TOKEN_TYPES.REFRESH },
    env.JWT_REFRESH_SECRET,
    options
  );
};

export const generateTokenPair = (
  payload: Omit<JwtPayload, "type" | "iat" | "exp">
): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};

export const getAccessTokenMaxAge = (): number => {
  return parseExpiryToMs(env.JWT_ACCESS_EXPIRY);
};

export const getRefreshTokenMaxAge = (): number => {
  return parseExpiryToMs(env.JWT_REFRESH_EXPIRY);
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};
