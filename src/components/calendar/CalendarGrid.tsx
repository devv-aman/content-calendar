import { useMemo } from "react";
import { CalendarDayCell } from "./CalendarDayCell";
import { CALENDAR_STRINGS } from "./calendar.constants";
import { getPostsForDate, filterPostsByChannel } from "./calendar.data";
import type { CalendarDay, ScheduledPost, PostChannel } from "./calendar.types";

interface CalendarGridProps {
  currentDate: Date;
  posts: ScheduledPost[];
  selectedChannel: PostChannel | "all";
  onPostClick: (post: ScheduledPost) => void;
}

function getCalendarDays(
  date: Date,
  posts: ScheduledPost[],
  selectedChannel: PostChannel | "all"
): CalendarDay[] {
  const year = date.getFullYear();
  const month = date.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Get the day of week for the first day (0 = Sunday)
  const startDayOfWeek = firstDay.getDay();

  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: CalendarDay[] = [];

  // Add days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayDate = new Date(year, month - 1, prevMonthLastDay - i);
    const dayPosts = filterPostsByChannel(
      getPostsForDate(dayDate, posts),
      selectedChannel
    );
    days.push({
      date: dayDate,
      isCurrentMonth: false,
      isToday: dayDate.getTime() === today.getTime(),
      posts: dayPosts,
    });
  }

  // Add days from current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayDate = new Date(year, month, day);
    dayDate.setHours(0, 0, 0, 0);
    const dayPosts = filterPostsByChannel(
      getPostsForDate(dayDate, posts),
      selectedChannel
    );
    days.push({
      date: dayDate,
      isCurrentMonth: true,
      isToday: dayDate.getTime() === today.getTime(),
      posts: dayPosts,
    });
  }

  // Add days from next month to complete the grid (6 rows = 42 cells)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const dayDate = new Date(year, month + 1, i);
    const dayPosts = filterPostsByChannel(
      getPostsForDate(dayDate, posts),
      selectedChannel
    );
    days.push({
      date: dayDate,
      isCurrentMonth: false,
      isToday: dayDate.getTime() === today.getTime(),
      posts: dayPosts,
    });
  }

  return days;
}

export function CalendarGrid({
  currentDate,
  posts,
  selectedChannel,
  onPostClick,
}: CalendarGridProps) {
  const calendarDays = useMemo(
    () => getCalendarDays(currentDate, posts, selectedChannel),
    [currentDate, posts, selectedChannel]
  );

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-(--neutral-border-main) sticky top-0 bg-(--neutral-bg-base) z-10">
        {CALENDAR_STRINGS.GRID.DAYS.map((day, index) => (
          <div
            key={day}
            className="py-3 px-2 text-center border-r border-(--neutral-border-subtle) last:border-r-0"
          >
            {/* Full day name on desktop, short on mobile */}
            <span className="hidden lg:inline text-sm font-medium text-(--neutral-text-secondary)">
              {day}
            </span>
            <span className="lg:hidden text-xs font-medium text-(--neutral-text-secondary)">
              {CALENDAR_STRINGS.GRID.DAYS_SHORT[index]}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 flex-1">
        {calendarDays.map((day, index) => (
          <CalendarDayCell
            key={`${day.date.toISOString()}-${index}`}
            day={day}
            onPostClick={onPostClick}
          />
        ))}
      </div>
    </div>
  );
}
