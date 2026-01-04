import { Response } from "express";
import { env } from "../config/env.js";
import { AUTH } from "../constants/auth.js";
import type { CookieOptions } from "../types/index.js";
import { getAccessTokenMaxAge, getRefreshTokenMaxAge } from "./jwt.js";

const getBaseCookieOptions = (): Omit<CookieOptions, "maxAge"> => ({
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: "lax",
  domain: env.COOKIE_DOMAIN,
  path: "/",
});

export const setAccessTokenCookie = (res: Response, token: string): void => {
  res.cookie(AUTH.COOKIE_NAMES.ACCESS_TOKEN, token, {
    ...getBaseCookieOptions(),
    maxAge: getAccessTokenMaxAge(),
  });
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie(AUTH.COOKIE_NAMES.REFRESH_TOKEN, token, {
    ...getBaseCookieOptions(),
    maxAge: getRefreshTokenMaxAge(),
  });
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
};

export const clearAuthCookies = (res: Response): void => {
  const clearOptions = {
    ...getBaseCookieOptions(),
    maxAge: 0,
  };

  res.cookie(AUTH.COOKIE_NAMES.ACCESS_TOKEN, "", clearOptions);
  res.cookie(AUTH.COOKIE_NAMES.REFRESH_TOKEN, "", clearOptions);
};
