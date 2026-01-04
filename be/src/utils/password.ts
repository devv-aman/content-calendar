import bcrypt from "bcryptjs";
import { AUTH } from "../constants/auth.js";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, AUTH.PASSWORD.SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
