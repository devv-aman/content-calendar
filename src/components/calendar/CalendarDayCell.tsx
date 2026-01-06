import { PostCard } from "./PostCard";
import { CALENDAR_STRINGS } from "./calendar.constants";
import type { CalendarDay, ScheduledPost } from "./calendar.types";

interface CalendarDayCellProps {
  day: CalendarDay;
  onPostClick: (post: ScheduledPost) => void;
}

const MAX_VISIBLE_POSTS = 4;

export function CalendarDayCell({ day, onPostClick }: CalendarDayCellProps) {
  const { date, isCurrentMonth, isToday, posts } = day;
  const dayNumber = date.getDate();
  const postCount = posts.length;
  const visiblePosts = posts.slice(0, MAX_VISIBLE_POSTS);
  const hasMorePosts = posts.length > MAX_VISIBLE_POSTS;

  const publicationText =
    postCount === 1
      ? `${postCount} ${CALENDAR_STRINGS.GRID.PUBLICATION}`
      : `${postCount} ${CALENDAR_STRINGS.GRID.PUBLICATIONS}`;

  return (
    <div
      className={`
        flex flex-col min-h-28 lg:min-h-36 p-2 border-r border-b border-(--neutral-border-subtle)
        ${
          isCurrentMonth
            ? "bg-(--neutral-bg-base)"
            : "bg-(--neutral-bg-surface)"
        }
      `}
    >
      {/* Day Number */}
      <div className="flex items-start justify-between mb-2">
        <div
          className={`
            flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
            ${
              isToday
                ? "bg-(--brand-primary-main) text-(--neutral-bg-base)"
                : ""
            }
            ${!isToday && isCurrentMonth ? "text-(--neutral-text-primary)" : ""}
            ${
              !isToday && !isCurrentMonth
                ? "text-(--neutral-text-disabled)"
                : ""
            }
          `}
        >
          {dayNumber}
        </div>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-1 flex-1 overflow-hidden">
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} onClick={onPostClick} />
        ))}
        {hasMorePosts && (
          <span className="text-xs text-(--neutral-text-secondary) pl-2">
            +{posts.length - MAX_VISIBLE_POSTS} more
          </span>
        )}
      </div>

      {/* Publication Count */}
      {postCount > 0 && (
        <div className="mt-auto pt-2">
          <span className="text-xs text-(--neutral-text-secondary)">
            {publicationText}
          </span>
        </div>
      )}
    </div>
  );
}
