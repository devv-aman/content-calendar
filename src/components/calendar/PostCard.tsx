import { PLATFORM_CONFIG } from "./calendar.constants";
import { formatPostTime } from "./calendar.data";
import type { ScheduledPost } from "./calendar.types";

interface PostCardProps {
  post: ScheduledPost;
  onClick: (post: ScheduledPost) => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const time = formatPostTime(post.scheduledTime);
  // Use the first channel for styling
  const primaryChannel = post.channels[0];
  const primaryPlatform = primaryChannel
    ? PLATFORM_CONFIG[primaryChannel]
    : null;

  if (!primaryPlatform) return null;

  return (
    <button
      type="button"
      onClick={() => onClick(post)}
      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs font-medium transition-all hover:opacity-80 cursor-pointer"
      style={{
        backgroundColor: `var(${primaryPlatform.bgColorVar})`,
        color: `var(${primaryPlatform.colorVar})`,
      }}
    >
      {/* Show all channel icons */}
      <div className="flex items-center -space-x-1">
        {post.channels.slice(0, 3).map((channel) => {
          const config = PLATFORM_CONFIG[channel];
          const Icon = config.icon;
          return (
            <Icon
              key={channel}
              size={14}
              className="shrink-0"
              color={`var(${config.colorVar})`}
            />
          );
        })}
        {post.channels.length > 3 && (
          <span className="text-[10px] ml-1">+{post.channels.length - 3}</span>
        )}
      </div>
      <span className="truncate">{time}</span>
    </button>
  );
}
