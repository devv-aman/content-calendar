import { supabase } from "../../config/database.js";
import { DATABASE } from "../../constants/database.js";
import { MESSAGES } from "../../constants/messages.js";
import { AUTH } from "../../constants/auth.js";
import { User, UserResponse, sanitizeUser } from "../../models/user.model.js";
import {
  comparePassword,
  hashPassword,
  generateTokenPair,
  generateAccessToken,
  AuthenticationError,
  NotFoundError,
  ConflictError,
} from "../../utils/index.js";
import type { TokenPair, JwtPayload } from "../../types/index.js";

interface AuthResult {
  user: UserResponse;
  tokens: TokenPair;
  isNewUser: boolean;
}

interface RefreshResult {
  accessToken: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export const registerUser = async (
  input: RegisterInput
): Promise<AuthResult> => {
  const { name, email, password } = input;

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from(DATABASE.TABLES.USERS)
    .select(DATABASE.COLUMNS.USERS.ID)
    .eq(DATABASE.COLUMNS.USERS.EMAIL, email)
    .single();

  if (existingUser) {
    throw new ConflictError(MESSAGES.AUTH.USER_ALREADY_EXISTS);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const { data: user, error } = await supabase
    .from(DATABASE.TABLES.USERS)
    .insert({
      name,
      email,
      password: hashedPassword,
      role: AUTH.ROLES.USER,
    })
    .select("*")
    .single<User>();

  if (error || !user) {
    throw new AuthenticationError(MESSAGES.DATABASE.QUERY_ERROR);
  }

  const tokenPayload: Omit<JwtPayload, "type" | "iat" | "exp"> = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokenPair(tokenPayload);

  return {
    user: sanitizeUser(user),
    tokens,
    isNewUser: true,
  };
};

/**
 * Login user - if user doesn't exist, auto-register
 */
export const loginUser = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResult> => {
  // Try to find existing user
  const { data: user, error } = await supabase
    .from(DATABASE.TABLES.USERS)
    .select("*")
    .eq(DATABASE.COLUMNS.USERS.EMAIL, email)
    .is(DATABASE.COLUMNS.USERS.DELETED_AT, null)
    .single<User>();

  // If user doesn't exist, auto-register
  if (error || !user) {
    // Auto-register with email as name if name not provided
    const userName = name || email.split("@")[0];
    return registerUser({ name: userName, email, password });
  }

  // User exists, verify password
  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new AuthenticationError(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const tokenPayload: Omit<JwtPayload, "type" | "iat" | "exp"> = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokenPair(tokenPayload);

  return {
    user: sanitizeUser(user),
    tokens,
    isNewUser: false,
  };
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (
  userId: string
): Promise<RefreshResult> => {
  const { data: user, error } = await supabase
    .from(DATABASE.TABLES.USERS)
    .select("*")
    .eq(DATABASE.COLUMNS.USERS.ID, userId)
    .is(DATABASE.COLUMNS.USERS.DELETED_AT, null)
    .single<User>();

  if (error || !user) {
    throw new AuthenticationError(MESSAGES.AUTH.USER_NOT_FOUND);
  }

  const tokenPayload: Omit<JwtPayload, "type" | "iat" | "exp"> = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);

  return { accessToken };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<UserResponse> => {
  const { data: user, error } = await supabase
    .from(DATABASE.TABLES.USERS)
    .select("*")
    .eq(DATABASE.COLUMNS.USERS.ID, userId)
    .is(DATABASE.COLUMNS.USERS.DELETED_AT, null)
    .single<User>();

  if (error || !user) {
    throw new NotFoundError(MESSAGES.AUTH.USER_NOT_FOUND);
  }

  return sanitizeUser(user);
};
