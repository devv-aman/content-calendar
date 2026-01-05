import { z } from "zod";
import { AUTH } from "../../constants/auth.js";
import { MESSAGES } from "../../constants/messages.js";

export const loginSchema = z.object({
  email: z
    .string({ required_error: MESSAGES.VALIDATION.REQUIRED_FIELD })
    .email({ message: MESSAGES.VALIDATION.INVALID_EMAIL }),
  password: z
    .string({ required_error: MESSAGES.VALIDATION.REQUIRED_FIELD })
    .min(AUTH.PASSWORD.MIN_LENGTH, {
      message: MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH,
    }),
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: MESSAGES.VALIDATION.REQUIRED_FIELD })
    .min(1, { message: MESSAGES.VALIDATION.REQUIRED_FIELD }),
  email: z
    .string({ required_error: MESSAGES.VALIDATION.REQUIRED_FIELD })
    .email({ message: MESSAGES.VALIDATION.INVALID_EMAIL }),
  password: z
    .string({ required_error: MESSAGES.VALIDATION.REQUIRED_FIELD })
    .min(AUTH.PASSWORD.MIN_LENGTH, {
      message: MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH,
    }),
});

export const googleAuthSchema = z.object({
  credential: z
    .string({ required_error: MESSAGES.AUTH.GOOGLE_TOKEN_REQUIRED })
    .min(1, { message: MESSAGES.AUTH.GOOGLE_TOKEN_REQUIRED }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
