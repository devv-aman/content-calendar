import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const SEED_CONSTANTS = {
  ADMIN_USER: {
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin",
  },
  TEST_USER: {
    name: "Test User",
    email: "user@example.com",
    password: "User@123",
    role: "user",
  },
  SALT_ROUNDS: 12,
  TABLE_NAME: "users",
  MESSAGES: {
    STARTING: "Starting database seed...",
    SUCCESS: "Database seeded successfully!",
    ERROR: "Error seeding database:",
    ADMIN_CREATED: "Admin user created:",
    USER_CREATED: "Test user created:",
    ADMIN_EXISTS: "Admin user already exists, skipping...",
    USER_EXISTS: "Test user already exists, skipping...",
    MISSING_ENV:
      "Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
  },
};

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

const seedDatabase = async (): Promise<void> => {
  console.log(SEED_CONSTANTS.MESSAGES.STARTING);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(SEED_CONSTANTS.MESSAGES.MISSING_ENV);
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const createUser = async (userData: SeedUser): Promise<void> => {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from(SEED_CONSTANTS.TABLE_NAME)
      .select("id")
      .eq("email", userData.email)
      .single();

    if (existingUser) {
      console.log(
        userData.role === "admin"
          ? SEED_CONSTANTS.MESSAGES.ADMIN_EXISTS
          : SEED_CONSTANTS.MESSAGES.USER_EXISTS
      );
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      userData.password,
      SEED_CONSTANTS.SALT_ROUNDS
    );

    // Insert user
    const { data, error } = await supabase
      .from(SEED_CONSTANTS.TABLE_NAME)
      .insert({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      })
      .select("id, email, role")
      .single();

    if (error) {
      throw new Error(`Failed to create ${userData.role}: ${error.message}`);
    }

    console.log(
      userData.role === "admin"
        ? SEED_CONSTANTS.MESSAGES.ADMIN_CREATED
        : SEED_CONSTANTS.MESSAGES.USER_CREATED,
      data
    );
  };

  try {
    // Create admin user
    await createUser(SEED_CONSTANTS.ADMIN_USER);

    // Create test user
    await createUser(SEED_CONSTANTS.TEST_USER);

    console.log(SEED_CONSTANTS.MESSAGES.SUCCESS);
    process.exit(0);
  } catch (error) {
    console.error(SEED_CONSTANTS.MESSAGES.ERROR, error);
    process.exit(1);
  }
};

seedDatabase();
