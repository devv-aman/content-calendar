import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3001"),

  // Supabase
  // Project URL - RESTful endpoint for querying and managing your database
  SUPABASE_URL: z.string().url(),
  // Service Role Key - Secret key to bypass RLS (use for server-side operations)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  // Cookie
  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECURE: z
    .string()
    .transform((val) => val === "true")
    .default("false"),

  // Frontend
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(parsed.error.format());
    process.exit(1);
  }

  return parsed.data;
};

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;
