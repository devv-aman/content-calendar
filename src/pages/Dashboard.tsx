import { useState, useCallback, useEffect } from "react";
import { Plus, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { MonthTitle } from "@/components/calendar/MonthTitle";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { PostDetailsSidebar } from "@/components/calendar/PostDetailsSidebar";
import { PostDrawer } from "@/components/calendar/PostDrawer";
import { CALENDAR_STRINGS } from "@/components/calendar/calendar.constants";
import { formatDateForApi } from "@/lib/posts.service";
import { usePosts } from "@/hooks/usePosts";
import type {
  PostChannel,
  ViewMode,
  DateRange,
  ScheduledPost,
  DrawerMode,
  CreatePostInput,
  UpdatePostInput,
} from "@/components/calendar/calendar.types";

function getInitialDateRange(): DateRange {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from, to };
}

function getWeekDateRange(date: Date): DateRange {
  const day = date.getDay();
  const from = new Date(date);
  from.setDate(date.getDate() - day);
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(from.getDate() + 6);
  return { from, to };
}

export function Dashboard() {
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedChannel, setSelectedChannel] = useState<PostChannel | "all">(
    "all"
  );
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [dateRange, setDateRange] = useState<DateRange>(getInitialDateRange);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("create");
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  // Posts context
  const {
    posts,
    isLoading,
    isMutating,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    clearError,
  } = usePosts();

  // Fetch posts when filters change
  useEffect(() => {
    const params = {
      channel: selectedChannel === "all" ? undefined : selectedChannel,
      start_date: formatDateForApi(dateRange.from),
      end_date: formatDateForApi(dateRange.to),
    };
    fetchPosts(params);
  }, [selectedChannel, dateRange, fetchPosts]);

  // Handlers
  const handleChannelChange = useCallback((channel: PostChannel | "all") => {
    setSelectedChannel(channel);
  }, []);

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      // Update date range based on view mode
      if (mode === "week") {
        setDateRange(getWeekDateRange(currentDate));
      } else {
        const from = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const to = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        setDateRange({ from, to });
      }
    },
    [currentDate]
  );

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    setCurrentDate(range.from);
  }, []);

  const handleAddNew = useCallback(() => {
    setDrawerMode("create");
    setEditingPost(null);
    setIsDrawerOpen(true);
  }, []);

  const handleMonthChange = useCallback(
    (date: Date) => {
      setCurrentDate(date);
      // Update date range based on view mode
      if (viewMode === "week") {
        setDateRange(getWeekDateRange(date));
      } else {
        const from = new Date(date.getFullYear(), date.getMonth(), 1);
        const to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setDateRange({ from, to });
      }
    },
    [viewMode]
  );

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

  const handleEditPost = useCallback((post: ScheduledPost) => {
    setEditingPost(post);
    setDrawerMode("edit");
    setIsDrawerOpen(true);
    setIsSidebarOpen(false);
  }, []);

  const handleDeletePost = useCallback(
    async (postId: string) => {
      const success = await deletePost(postId);
      if (success) {
        setIsSidebarOpen(false);
        setSelectedPost(null);
      }
      return success;
    },
    [deletePost]
  );

  const handleDrawerSubmit = useCallback(
    async (input: CreatePostInput | UpdatePostInput): Promise<boolean> => {
      if (drawerMode === "create") {
        const result = await createPost(input as CreatePostInput);
        return result !== null;
      } else if (editingPost) {
        const result = await updatePost(
          editingPost.id,
          input as UpdatePostInput
        );
        return result !== null;
      }
      return false;
    },
    [drawerMode, editingPost, createPost, updatePost]
  );

  const handleRetry = useCallback(() => {
    clearError();
    const params = {
      channel: selectedChannel === "all" ? undefined : selectedChannel,
      start_date: formatDateForApi(dateRange.from),
      end_date: formatDateForApi(dateRange.to),
    };
    fetchPosts(params);
  }, [clearError, selectedChannel, dateRange, fetchPosts]);

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

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-4 rounded-md bg-(--brand-accent01-opacity-12) border border-(--brand-accent01-shade-3)">
          <AlertCircle className="size-5 text-(--brand-accent01-shade-3) shrink-0" />
          <p className="flex-1 text-sm text-(--brand-accent01-shade-3)">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="shrink-0 border-(--brand-accent01-shade-3) text-(--brand-accent01-shade-3) hover:bg-(--brand-accent01-opacity-12)"
          >
            {CALENDAR_STRINGS.ERROR.RETRY}
          </Button>
        </div>
      )}

      {/* Calendar Grid with Loading Overlay */}
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-(--neutral-bg-base)/80">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-8 animate-spin text-(--brand-primary-main)" />
              <p className="text-sm text-(--neutral-text-secondary)">
                {CALENDAR_STRINGS.LOADING.POSTS}
              </p>
            </div>
          </div>
        )}

        <CalendarGrid
          currentDate={currentDate}
          posts={posts}
          selectedChannel={selectedChannel}
          onPostClick={handlePostClick}
        />
      </div>

      {/* Post Details Sidebar */}
      <PostDetailsSidebar
        post={selectedPost}
        open={isSidebarOpen}
        onOpenChange={handleSidebarClose}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
        isDeleting={isMutating}
      />

      {/* Post Create/Edit Drawer */}
      <PostDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        mode={drawerMode}
        post={editingPost}
        onSubmit={handleDrawerSubmit}
        isSubmitting={isMutating}
      />
    </div>
  );
}
