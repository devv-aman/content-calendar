import { OAuth2Client } from "google-auth-library";
import { supabase } from "../../config/database.js";
import { env } from "../../config/env.js";
import { DATABASE } from "../../constants/database.js";
import { MESSAGES } from "../../constants/messages.js";
import { AUTH } from "../../constants/auth.js";
import {
  User,
  UserResponse,
  sanitizeUser,
  GoogleUserInput,
} from "../../models/user.model.js";
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

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

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

  // User exists - check if they have a password (Google users may not have one)
  if (!user.password) {
    throw new AuthenticationError(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  // Verify password
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

/**
 * Verify Google ID token and extract user info
 */
const verifyGoogleToken = async (
  credential: string
): Promise<GoogleUserInput> => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      throw new AuthenticationError(MESSAGES.AUTH.GOOGLE_TOKEN_INVALID);
    }

    return {
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      google_id: payload.sub,
      avatar_url: payload.picture || null,
    };
  } catch {
    throw new AuthenticationError(MESSAGES.AUTH.GOOGLE_TOKEN_INVALID);
  }
};

/**
 * Google OAuth login - find or create user
 */
export const googleLogin = async (credential: string): Promise<AuthResult> => {
  // Verify the Google token and extract user info
  const googleUser = await verifyGoogleToken(credential);

  // Try to find existing user by google_id or email
  const { data: existingUser } = await supabase
    .from(DATABASE.TABLES.USERS)
    .select("*")
    .or(
      `${DATABASE.COLUMNS.USERS.GOOGLE_ID}.eq.${googleUser.google_id},${DATABASE.COLUMNS.USERS.EMAIL}.eq.${googleUser.email}`
    )
    .is(DATABASE.COLUMNS.USERS.DELETED_AT, null)
    .single<User>();

  let user: User;
  let isNewUser = false;

  if (existingUser) {
    // User exists - update google_id and avatar if needed
    if (
      !existingUser.google_id ||
      existingUser.avatar_url !== googleUser.avatar_url
    ) {
      const { data: updatedUser, error: updateError } = await supabase
        .from(DATABASE.TABLES.USERS)
        .update({
          google_id: googleUser.google_id,
          avatar_url: googleUser.avatar_url,
        })
        .eq(DATABASE.COLUMNS.USERS.ID, existingUser.id)
        .select("*")
        .single<User>();

      if (updateError || !updatedUser) {
        throw new AuthenticationError(MESSAGES.DATABASE.QUERY_ERROR);
      }
      user = updatedUser;
    } else {
      user = existingUser;
    }
  } else {
    // Create new user with Google info (no password)
    const { data: newUser, error: createError } = await supabase
      .from(DATABASE.TABLES.USERS)
      .insert({
        name: googleUser.name,
        email: googleUser.email,
        google_id: googleUser.google_id,
        avatar_url: googleUser.avatar_url,
        role: AUTH.ROLES.USER,
      })
      .select("*")
      .single<User>();

    if (createError || !newUser) {
      throw new AuthenticationError(MESSAGES.DATABASE.QUERY_ERROR);
    }

    user = newUser;
    isNewUser = true;
  }

  // Generate tokens
  const tokenPayload: Omit<JwtPayload, "type" | "iat" | "exp"> = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokenPair(tokenPayload);

  return {
    user: sanitizeUser(user),
    tokens,
    isNewUser,
  };
};
