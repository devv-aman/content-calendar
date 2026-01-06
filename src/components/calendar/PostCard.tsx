import { PLATFORM_CONFIG } from "./calendar.constants";
import { formatPostTime } from "./calendar.data";
import type { ScheduledPost } from "./calendar.types";

interface PostCardProps {
  post: ScheduledPost;
  onClick: (post: ScheduledPost) => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const platform = PLATFORM_CONFIG[post.platform];
  const Icon = platform.icon;
  const time = formatPostTime(post.scheduledTime);

  return (
    <button
      type="button"
      onClick={() => onClick(post)}
      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs font-medium transition-all hover:opacity-80 cursor-pointer"
      style={{
        backgroundColor: `var(${platform.bgColorVar})`,
        color: `var(${platform.colorVar})`,
      }}
    >
      <Icon size={14} className="shrink-0" />
      <span className="truncate">{time}</span>
    </button>
  );
}
