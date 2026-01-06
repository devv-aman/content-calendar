import { useState } from "react";
import {
  Clock,
  Pencil,
  Trash2,
  CalendarClock,
  Loader2,
  FileIcon,
  ExternalLink,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CALENDAR_STRINGS, PLATFORM_CONFIG } from "./calendar.constants";
import { formatPostTime } from "./calendar.data";
import type { ScheduledPost } from "./calendar.types";

interface PostDetailsSidebarProps {
  post: ScheduledPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (post: ScheduledPost) => void;
  onDelete?: (postId: string) => Promise<boolean>;
  isDeleting?: boolean;
}

export function PostDetailsSidebar({
  post,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  isDeleting = false,
}: PostDetailsSidebarProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!post) return null;

  const time = formatPostTime(post.scheduledTime);
  const dateStr = post.scheduledTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusLabel =
    CALENDAR_STRINGS.STATUS[
      post.status.toUpperCase() as keyof typeof CALENDAR_STRINGS.STATUS
    ];

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (onDelete) {
      const success = await onDelete(post.id);
      if (success) {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const handleReschedule = () => {
    // Open edit drawer with focus on date/time
    if (onEdit) {
      onEdit(post);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col p-0">
          <SheetHeader className="border-b border-(--neutral-border-main) p-6 pb-4">
            <SheetTitle className="text-(--neutral-text-primary) text-lg">
              {post.title}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {CALENDAR_STRINGS.SIDEBAR.TITLE}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto px-6 py-4 space-y-6">
            {/* Platforms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-(--neutral-text-secondary)">
                {post.channels.length > 1
                  ? CALENDAR_STRINGS.SIDEBAR.PLATFORMS
                  : CALENDAR_STRINGS.SIDEBAR.PLATFORM}
              </label>
              <div className="flex flex-wrap gap-2">
                {post.channels.map((channel) => {
                  const platform = PLATFORM_CONFIG[channel];
                  const Icon = platform.icon;
                  return (
                    <div
                      key={channel}
                      className="flex items-center gap-2 px-3 py-2 rounded-md"
                      style={{
                        backgroundColor: `var(${platform.bgColorVar})`,
                        color: `var(${platform.colorVar})`,
                      }}
                    >
                      <Icon size={16} />
                      <span className="font-medium text-sm">
                        {platform.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scheduled Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-(--neutral-text-secondary)">
                {CALENDAR_STRINGS.SIDEBAR.SCHEDULED_TIME}
              </label>
              <div className="flex items-center gap-2 text-(--neutral-text-primary)">
                <Clock className="size-4 text-(--neutral-text-secondary)" />
                <span>{dateStr}</span>
                <span className="text-(--neutral-text-secondary)">at</span>
                <span>{time}</span>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-(--neutral-text-secondary)">
                {CALENDAR_STRINGS.SIDEBAR.STATUS}
              </label>
              <Badge
                variant="outline"
                className={`
                  ${
                    post.status === "scheduled"
                      ? "bg-(--brand-primary-opacity-12) text-(--brand-primary-main) border-(--brand-primary-main)"
                      : ""
                  }
                  ${
                    post.status === "published"
                      ? "bg-(--brand-accent02-opacity-12) text-(--brand-accent02-shade-3) border-(--brand-accent02-shade-3)"
                      : ""
                  }
                  ${
                    post.status === "draft"
                      ? "bg-(--neutral-bg-elevated) text-(--neutral-text-secondary) border-(--neutral-border-main)"
                      : ""
                  }
                `}
              >
                {statusLabel}
              </Badge>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-(--neutral-text-secondary)">
                {CALENDAR_STRINGS.SIDEBAR.CONTENT}
              </label>
              <p className="text-(--neutral-text-primary) text-sm leading-relaxed bg-(--neutral-bg-surface) p-3 rounded-md">
                {post.content}
              </p>
            </div>

            {/* Attachment */}
            {post.fileUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-(--neutral-text-secondary)">
                  {CALENDAR_STRINGS.SIDEBAR.ATTACHMENT}
                </label>
                <div className="border border-(--neutral-border-main) rounded-md overflow-hidden">
                  {post.fileType?.startsWith("image/") ? (
                    <img
                      src={post.fileUrl}
                      alt={post.fileName ?? "Attachment"}
                      className="w-full h-auto max-h-48 object-cover"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-(--neutral-bg-surface)">
                      <FileIcon className="size-5 text-(--neutral-text-secondary)" />
                      <span className="flex-1 text-sm text-(--neutral-text-primary) truncate">
                        {post.fileName}
                      </span>
                      <a
                        href={post.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-(--state-overlay-hover)"
                      >
                        <ExternalLink className="size-4 text-(--neutral-text-secondary)" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-(--neutral-border-main) p-6 pt-4 flex-col gap-3">
            <Button
              variant="outline"
              onClick={handleReschedule}
              className="w-full py-3"
            >
              <CalendarClock className="size-4" />
              {CALENDAR_STRINGS.SIDEBAR.ACTIONS.RESCHEDULE}
            </Button>
            <Button
              variant="outline"
              onClick={handleEdit}
              className="w-full py-3"
            >
              <Pencil className="size-4" />
              {CALENDAR_STRINGS.SIDEBAR.ACTIONS.EDIT}
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteClick}
              className="w-full py-3 text-(--brand-accent01-shade-3) border-(--brand-accent01-shade-3) hover:bg-(--brand-accent01-opacity-12)"
            >
              <Trash2 className="size-4" />
              {CALENDAR_STRINGS.SIDEBAR.ACTIONS.DELETE}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-(--neutral-bg-base) border-(--neutral-border-main)">
          <DialogHeader>
            <DialogTitle className="text-(--neutral-text-primary)">
              {CALENDAR_STRINGS.DELETE_DIALOG.TITLE}
            </DialogTitle>
            <DialogDescription className="text-(--neutral-text-secondary)">
              {CALENDAR_STRINGS.DELETE_DIALOG.DESCRIPTION}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {CALENDAR_STRINGS.DELETE_DIALOG.CANCEL}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-(--brand-accent01-shade-3) text-(--neutral-bg-base) hover:opacity-90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {CALENDAR_STRINGS.DELETE_DIALOG.DELETING}
                </>
              ) : (
                CALENDAR_STRINGS.DELETE_DIALOG.CONFIRM
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
