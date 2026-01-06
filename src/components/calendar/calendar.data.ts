import type { ScheduledPost, PostChannel } from "./calendar.types";

// Function to get posts for a specific date
export function getPostsForDate(
  date: Date,
  posts: ScheduledPost[]
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

// Function to filter posts by channel (for UI-side filtering)
export function filterPostsByChannel(
  posts: ScheduledPost[],
  channel: PostChannel | "all"
): ScheduledPost[] {
  if (channel === "all") return posts;
  return posts.filter((post) => post.channels.includes(channel));
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
