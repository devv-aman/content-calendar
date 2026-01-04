import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../../constants/messages.js";
import { sendSuccess } from "../../utils/response.js";
import {
  setAuthCookies,
  clearAuthCookies,
  setAccessTokenCookie,
} from "../../utils/cookies.js";
import * as authService from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import type { JwtPayload } from "../../types/index.js";

/**
 * Check if access token should be included in response
 * Use query param ?includeToken=true for Swagger testing
 */
const shouldIncludeToken = (req: Request): boolean => {
  return req.query.includeToken === "true";
};

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login or auto-register
 *     description: Authenticate user with email and password. If user doesn't exist, automatically registers them. Add ?includeToken=true to get accessToken in response.
 *     parameters:
 *       - in: query
 *         name: includeToken
 *         schema:
 *           type: string
 *           enum: ["true"]
 *         description: Set to "true" to include accessToken in response (for testing)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: HTTP-only cookies containing access_token and refresh_token
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    const { user, tokens, isNewUser } = await authService.loginUser(
      email,
      password
    );

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const message = isNewUser
      ? MESSAGES.AUTH.REGISTER_SUCCESS
      : MESSAGES.AUTH.LOGIN_SUCCESS;

    // Include access token in response if requested (for Swagger testing)
    const responseData = shouldIncludeToken(req)
      ? { ...user, accessToken: tokens.accessToken }
      : user;

    sendSuccess(res, 200, message, responseData);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new user
 *     description: Create a new user account with name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: Registration successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: HTTP-only cookies containing access_token and refresh_token
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body as RegisterInput;

    const { user, tokens } = await authService.registerUser({
      name,
      email,
      password,
    });

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    // Include access token in response if requested (for Swagger testing)
    const responseData = shouldIncludeToken(req)
      ? { ...user, accessToken: tokens.accessToken }
      : user;

    sendSuccess(res, 201, MESSAGES.AUTH.REGISTER_SUCCESS, responseData);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Refresh the access token using the refresh token cookie.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: HTTP-only cookie containing new access_token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as JwtPayload;

    const { accessToken } = await authService.refreshAccessToken(user.userId);

    setAccessTokenCookie(res, accessToken);

    sendSuccess(res, 200, MESSAGES.AUTH.TOKEN_REFRESHED);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User logout
 *     description: Logout user by clearing authentication cookies.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Cleared authentication cookies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    clearAuthCookies(res);

    sendSuccess(res, 200, MESSAGES.AUTH.LOGOUT_SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user details
 *     description: Get the details of the currently authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tokenUser = req.user as JwtPayload;

    const user = await authService.getUserById(tokenUser.userId);

    sendSuccess(res, 200, MESSAGES.AUTH.USER_FETCHED, user);
  } catch (error) {
    next(error);
  }
};
