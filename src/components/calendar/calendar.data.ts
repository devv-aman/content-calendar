import type { ScheduledPost, SocialPlatform } from "./calendar.types";

// Helper to create a date for the current month
function createDate(day: number, hour: number, minute: number): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), day, hour, minute);
}

// Helper to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Mock posts for the current month
export const MOCK_POSTS: ScheduledPost[] = [
  // Day 2
  {
    id: generateId(),
    platform: "instagram",
    scheduledTime: createDate(2, 11, 30),
    title: "New Product Launch",
    content:
      "Excited to announce our new product line! Check out the link in bio for more details. #newproduct #launch",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "facebook",
    scheduledTime: createDate(2, 12, 30),
    title: "Behind the Scenes",
    content:
      "Take a look behind the scenes of our latest photoshoot. The team worked so hard on this!",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "twitter",
    scheduledTime: createDate(2, 13, 30),
    title: "Quick Update",
    content:
      "Big news coming soon! Stay tuned for our announcement later this week. 🚀",
    status: "draft",
  },
  {
    id: generateId(),
    platform: "youtube",
    scheduledTime: createDate(2, 14, 30),
    title: "Tutorial Video",
    content:
      "New tutorial dropping today! Learn how to maximize your productivity with our app.",
    status: "scheduled",
  },

  // Day 4
  {
    id: generateId(),
    platform: "twitter",
    scheduledTime: createDate(4, 11, 30),
    title: "Engagement Post",
    content: "What's your favorite feature? Let us know in the comments! 💬",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "youtube",
    scheduledTime: createDate(4, 12, 30),
    title: "Weekly Vlog",
    content: "This week's vlog is all about our team retreat. Don't miss it!",
    status: "published",
  },

  // Day 6
  {
    id: generateId(),
    platform: "linkedin",
    scheduledTime: createDate(6, 11, 30),
    title: "Industry Insights",
    content:
      "Our latest report on industry trends is now available. Download your free copy today.",
    status: "scheduled",
  },

  // Day 10
  {
    id: generateId(),
    platform: "instagram",
    scheduledTime: createDate(10, 11, 30),
    title: "User Spotlight",
    content:
      "Featuring one of our amazing users today! Thanks for being part of our community.",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "facebook",
    scheduledTime: createDate(10, 12, 30),
    title: "Community Event",
    content:
      "Join us for our virtual community meetup this Friday. Register now!",
    status: "draft",
  },

  // Day 12
  {
    id: generateId(),
    platform: "linkedin",
    scheduledTime: createDate(12, 11, 30),
    title: "Hiring Announcement",
    content:
      "We're growing! Check out our open positions and join our amazing team.",
    status: "scheduled",
  },

  // Day 14
  {
    id: generateId(),
    platform: "facebook",
    scheduledTime: createDate(14, 11, 30),
    title: "Weekend Vibes",
    content: "Happy Friday everyone! What are your plans for the weekend?",
    status: "scheduled",
  },

  // Day 15
  {
    id: generateId(),
    platform: "instagram",
    scheduledTime: createDate(15, 11, 30),
    title: "Product Tips",
    content: "Pro tip: Use our advanced settings to customize your experience!",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "facebook",
    scheduledTime: createDate(15, 12, 30),
    title: "Flash Sale",
    content: "24-hour flash sale starting now! Use code FLASH25 for 25% off.",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "youtube",
    scheduledTime: createDate(15, 13, 30),
    title: "Live Q&A",
    content:
      "Going live at 3 PM EST to answer all your questions. See you there!",
    status: "scheduled",
  },

  // Day 16
  {
    id: generateId(),
    platform: "instagram",
    scheduledTime: createDate(16, 11, 30),
    title: "Motivation Monday",
    content: "Start your week strong! 💪 What's your main goal for this week?",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "facebook",
    scheduledTime: createDate(16, 12, 30),
    title: "Blog Post Share",
    content:
      "New blog post: 10 Tips for Better Content Marketing. Link in comments!",
    status: "scheduled",
  },

  // Day 18
  {
    id: generateId(),
    platform: "youtube",
    scheduledTime: createDate(18, 11, 30),
    title: "Customer Story",
    content:
      "Hear how our platform helped this small business grow 300% in one year.",
    status: "scheduled",
  },

  // Day 20
  {
    id: generateId(),
    platform: "twitter",
    scheduledTime: createDate(20, 11, 30),
    title: "Poll",
    content: "Which feature should we build next? Vote below! 📊",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "youtube",
    scheduledTime: createDate(20, 12, 30),
    title: "Product Demo",
    content:
      "Full product demo - everything you need to know in under 10 minutes.",
    status: "draft",
  },

  // Day 22
  {
    id: generateId(),
    platform: "instagram",
    scheduledTime: createDate(22, 10, 0),
    title: "Throwback Thursday",
    content:
      "Throwback to when we first started! Look how far we've come. #tbt",
    status: "published",
  },

  // Day 25
  {
    id: generateId(),
    platform: "linkedin",
    scheduledTime: createDate(25, 9, 0),
    title: "Case Study",
    content:
      "New case study: How Enterprise Co. saved 40% on operational costs with our solution.",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "facebook",
    scheduledTime: createDate(25, 14, 0),
    title: "Team Feature",
    content:
      "Meet our engineering team! The brilliant minds behind our latest features.",
    status: "scheduled",
  },

  // Day 28
  {
    id: generateId(),
    platform: "twitter",
    scheduledTime: createDate(28, 11, 30),
    title: "Month Recap",
    content:
      "What a month! Here's a quick recap of everything we accomplished. Thread 🧵",
    status: "scheduled",
  },
  {
    id: generateId(),
    platform: "instagram",
    scheduledTime: createDate(28, 15, 0),
    title: "Sneak Peek",
    content: "Sneak peek at what's coming next month... 👀 Stay tuned!",
    status: "draft",
  },
];

// Function to get posts for a specific date
export function getPostsForDate(
  date: Date,
  posts: ScheduledPost[] = MOCK_POSTS
): ScheduledPost[] {
  return posts.filter((post) => {
    const postDate = new Date(post.scheduledTime);
    return (
      postDate.getFullYear() === date.getFullYear() &&
      postDate.getMonth() === date.getMonth() &&
      postDate.getDate() === date.getDate()
    );
  });
}

// Function to filter posts by platform
export function filterPostsByPlatform(
  posts: ScheduledPost[],
  platform: SocialPlatform | "all"
): ScheduledPost[] {
  if (platform === "all") return posts;
  return posts.filter((post) => post.platform === platform);
}

// Function to format time for display
export function formatPostTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
