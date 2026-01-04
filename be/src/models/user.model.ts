import { UserRole } from "../constants/auth.js";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export const sanitizeUser = (user: User): UserResponse => {
  const { password: _password, deleted_at: _deletedAt, ...userResponse } = user;
  return userResponse;
};
