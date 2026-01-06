import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SEED_CONSTANTS = {
  TABLES: {
    USERS: "users",
    POSTS: "posts",
  },
  CHANNELS: [
    "twitter",
    "facebook",
    "instagram",
    "youtube",
    "linkedin",
  ] as const,
  MESSAGES: {
    STARTING: "Starting posts seed...",
    SUCCESS: "Posts seeded successfully!",
    ERROR: "Error seeding posts:",
    POSTS_CREATED: "Created posts:",
    USER_NOT_FOUND: "Test user not found. Please run 'pnpm seed' first.",
    MISSING_ENV:
      "Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
  },
};

type Channel = (typeof SEED_CONSTANTS.CHANNELS)[number];

interface SeedPost {
  title: string;
  content: string;
  channel: Channel[];
  scheduled_time: string;
}

// Generate sample posts for the next 30 days
const generateSamplePosts = (): SeedPost[] => {
  const posts: SeedPost[] = [];
  const now = new Date();

  const sampleContent = [
    {
      title: "New Product Launch Announcement",
      content:
        "Excited to announce our latest product! Stay tuned for more details. #newproduct #launch",
    },
    {
      title: "Behind the Scenes",
      content:
        "Take a peek behind the scenes of our creative process. Our team is working hard to bring you amazing content!",
    },
    {
      title: "Weekly Tips & Tricks",
      content:
        "Here are 5 tips to boost your productivity this week: 1. Plan your day 2. Take breaks 3. Stay hydrated 4. Exercise 5. Get enough sleep",
    },
    {
      title: "Customer Success Story",
      content:
        "Read how one of our customers achieved 200% growth using our platform. Link in bio! #successstory #growth",
    },
    {
      title: "Industry News Update",
      content:
        "Breaking: Major changes coming to the industry. Here's what you need to know and how to prepare.",
    },
    {
      title: "Team Spotlight",
      content:
        "Meet our amazing team member who has been instrumental in our recent success. Thank you for your dedication!",
    },
    {
      title: "Upcoming Event",
      content:
        "Mark your calendars! We're hosting a live webinar next week. Register now to secure your spot.",
    },
    {
      title: "Monthly Recap",
      content:
        "What a month it has been! Here are the highlights and achievements from the past 30 days.",
    },
    {
      title: "Tutorial: Getting Started",
      content:
        "New to our platform? Check out this step-by-step guide to get started in just 5 minutes.",
    },
    {
      title: "Community Question",
      content:
        "We want to hear from you! What features would you like to see next? Drop your suggestions in the comments.",
    },
  ];

  // Helper to get random channels (1-3 channels per post)
  const getRandomChannels = (): Channel[] => {
    const numChannels = Math.floor(Math.random() * 3) + 1; // 1-3 channels
    const shuffled = [...SEED_CONSTANTS.CHANNELS].sort(
      () => Math.random() - 0.5
    );
    return shuffled.slice(0, numChannels);
  };

  // Create posts spread across the next 30 days
  for (let i = 0; i < 15; i++) {
    const daysOffset = Math.floor(Math.random() * 30);
    const hoursOffset = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
    const minutesOffset = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45

    const scheduledDate = new Date(now);
    scheduledDate.setDate(scheduledDate.getDate() + daysOffset);
    scheduledDate.setHours(hoursOffset, minutesOffset, 0, 0);

    const contentIndex = i % sampleContent.length;

    posts.push({
      title: sampleContent[contentIndex].title,
      content: sampleContent[contentIndex].content,
      channel: getRandomChannels(),
      scheduled_time: scheduledDate.toISOString(),
    });
  }

  return posts;
};

const seedPosts = async (): Promise<void> => {
  console.log(SEED_CONSTANTS.MESSAGES.STARTING);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(SEED_CONSTANTS.MESSAGES.MISSING_ENV);
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get test user
    const { data: testUser, error: userError } = await supabase
      .from(SEED_CONSTANTS.TABLES.USERS)
      .select("id")
      .eq("email", "user@example.com")
      .single();

    if (userError || !testUser) {
      console.error(SEED_CONSTANTS.MESSAGES.USER_NOT_FOUND);
      process.exit(1);
    }

    // Generate sample posts
    const samplePosts = generateSamplePosts();

    // Insert posts
    const postsToInsert = samplePosts.map((post) => ({
      ...post,
      user_id: testUser.id,
    }));

    const { data: createdPosts, error: insertError } = await supabase
      .from(SEED_CONSTANTS.TABLES.POSTS)
      .insert(postsToInsert)
      .select("id, title, channel, scheduled_time");

    if (insertError) {
      throw new Error(`Failed to create posts: ${insertError.message}`);
    }

    console.log(SEED_CONSTANTS.MESSAGES.POSTS_CREATED, createdPosts?.length);

    // Log a summary
    if (createdPosts) {
      const channelCounts = SEED_CONSTANTS.CHANNELS.reduce((acc, channel) => {
        acc[channel] = createdPosts.filter(
          (p) => Array.isArray(p.channel) && p.channel.includes(channel)
        ).length;
        return acc;
      }, {} as Record<string, number>);

      console.log("Posts by channel:", channelCounts);
    }

    console.log(SEED_CONSTANTS.MESSAGES.SUCCESS);
    process.exit(0);
  } catch (error) {
    console.error(SEED_CONSTANTS.MESSAGES.ERROR, error);
    process.exit(1);
  }
};

seedPosts();
