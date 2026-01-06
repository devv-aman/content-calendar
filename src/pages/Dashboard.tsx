import { useState, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { MonthTitle } from "@/components/calendar/MonthTitle";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { PostDetailsSidebar } from "@/components/calendar/PostDetailsSidebar";
import { MOCK_POSTS } from "@/components/calendar/calendar.data";
import { CALENDAR_STRINGS } from "@/components/calendar/calendar.constants";
import type {
  SocialPlatform,
  ViewMode,
  DateRange,
  ScheduledPost,
} from "@/components/calendar/calendar.types";

function getInitialDateRange(): DateRange {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from, to };
}

export function Dashboard() {
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedChannel, setSelectedChannel] = useState<
    SocialPlatform | "all"
  >("all");
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [dateRange, setDateRange] = useState<DateRange>(getInitialDateRange);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handlers
  const handleChannelChange = useCallback((channel: SocialPlatform | "all") => {
    setSelectedChannel(channel);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    setCurrentDate(range.from);
  }, []);

  const handleAddNew = useCallback(() => {
    // Dummy action - will be implemented later
  }, []);

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentDate(date);
    // Update date range to match the selected month
    const from = new Date(date.getFullYear(), date.getMonth(), 1);
    const to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setDateRange({ from, to });
  }, []);

  const handlePostClick = useCallback((post: ScheduledPost) => {
    setSelectedPost(post);
    setIsSidebarOpen(true);
  }, []);

  const handleSidebarClose = useCallback((open: boolean) => {
    setIsSidebarOpen(open);
    if (!open) {
      setSelectedPost(null);
    }
  }, []);

  // Memoized posts for the calendar
  const posts = useMemo(() => MOCK_POSTS, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header with Filters */}
      <CalendarHeader
        selectedChannel={selectedChannel}
        onChannelChange={handleChannelChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onAddNew={handleAddNew}
      />

      {/* Month Title Row */}
      <div className="flex items-center justify-between py-4">
        <MonthTitle
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
        />

        {/* Add New Button - Mobile */}
        <Button
          onClick={handleAddNew}
          className="lg:hidden bg-(--brand-primary-main) text-(--neutral-bg-base) hover:opacity-90"
        >
          <Plus className="size-4" />
          {CALENDAR_STRINGS.HEADER.ADD_NEW}
        </Button>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid
        currentDate={currentDate}
        posts={posts}
        selectedChannel={selectedChannel}
        onPostClick={handlePostClick}
      />

      {/* Post Details Sidebar */}
      <PostDetailsSidebar
        post={selectedPost}
        open={isSidebarOpen}
        onOpenChange={handleSidebarClose}
      />
    </div>
  );
}
