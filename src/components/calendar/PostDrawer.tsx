import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
} from "react";
import { Upload, X, Loader2, FileIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CALENDAR_STRINGS,
  PLATFORM_CONFIG,
  ALL_PLATFORMS,
} from "./calendar.constants";
import { formatDateTimeForApi } from "@/lib/posts.service";
import type {
  ScheduledPost,
  PostChannel,
  DrawerMode,
  CreatePostInput,
  UpdatePostInput,
} from "./calendar.types";

interface PostDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: DrawerMode;
  post?: ScheduledPost | null;
  onSubmit: (input: CreatePostInput | UpdatePostInput) => Promise<boolean>;
  isSubmitting: boolean;
}

interface FormErrors {
  title?: string;
  content?: string;
  channels?: string;
  date?: string;
  time?: string;
}

export function PostDrawer({
  open,
  onOpenChange,
  mode,
  post,
  onSubmit,
  isSubmitting,
}: PostDrawerProps) {
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<PostChannel[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState("12:00");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when drawer opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && post) {
        setTitle(post.title);
        setContent(post.content);
        setSelectedChannels(post.channels);
        setScheduledDate(post.scheduledTime);
        setScheduledTime(format(post.scheduledTime, "HH:mm"));
        setFile(null);
        setFilePreview(post.fileUrl ?? null);
      } else {
        // Create mode - reset to defaults
        setTitle("");
        setContent("");
        setSelectedChannels([]);
        setScheduledDate(undefined);
        setScheduledTime("12:00");
        setFile(null);
        setFilePreview(null);
      }
      setErrors({});
    }
  }, [open, mode, post]);

  const handleChannelToggle = useCallback((channel: PostChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
    setErrors((prev) => ({ ...prev, channels: undefined }));
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        // Create preview for images
        if (selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreview(reader.result as string);
          };
          reader.readAsDataURL(selectedFile);
        } else {
          setFilePreview(null);
        }
      }
    },
    []
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = CALENDAR_STRINGS.DRAWER.VALIDATION.TITLE_REQUIRED;
    }
    if (!content.trim()) {
      newErrors.content = CALENDAR_STRINGS.DRAWER.VALIDATION.CONTENT_REQUIRED;
    }
    if (selectedChannels.length === 0) {
      newErrors.channels = CALENDAR_STRINGS.DRAWER.VALIDATION.CHANNEL_REQUIRED;
    }
    if (!scheduledDate) {
      newErrors.date = CALENDAR_STRINGS.DRAWER.VALIDATION.DATE_REQUIRED;
    }
    if (!scheduledTime) {
      newErrors.time = CALENDAR_STRINGS.DRAWER.VALIDATION.TIME_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, content, selectedChannels, scheduledDate, scheduledTime]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    // Combine date and time
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const dateTime = new Date(scheduledDate!);
    dateTime.setHours(hours, minutes, 0, 0);

    const channelString = selectedChannels.join(",");
    const scheduledTimeStr = formatDateTimeForApi(dateTime);

    if (mode === "create") {
      const input: CreatePostInput = {
        title: title.trim(),
        content: content.trim(),
        channel: channelString,
        scheduled_time: scheduledTimeStr,
        file: file ?? undefined,
      };
      const success = await onSubmit(input);
      if (success) {
        onOpenChange(false);
      }
    } else {
      const input: UpdatePostInput = {
        title: title.trim(),
        content: content.trim(),
        channel: channelString,
        scheduled_time: scheduledTimeStr,
        file: file ?? undefined,
      };
      const success = await onSubmit(input);
      if (success) {
        onOpenChange(false);
      }
    }
  }, [
    validateForm,
    scheduledTime,
    scheduledDate,
    selectedChannels,
    mode,
    title,
    content,
    file,
    onSubmit,
    onOpenChange,
  ]);

  const drawerTitle =
    mode === "create"
      ? CALENDAR_STRINGS.DRAWER.CREATE_TITLE
      : CALENDAR_STRINGS.DRAWER.EDIT_TITLE;

  const submitLabel =
    mode === "create"
      ? CALENDAR_STRINGS.DRAWER.SUBMIT_CREATE
      : CALENDAR_STRINGS.DRAWER.SUBMIT_UPDATE;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-(--neutral-border-main) p-6 pb-4">
          <SheetTitle className="text-(--neutral-text-primary) text-lg">
            {drawerTitle}
          </SheetTitle>
          <SheetDescription className="sr-only">{drawerTitle}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto px-6 py-4 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="post-title"
              className="text-sm font-medium text-(--neutral-text-secondary)"
            >
              {CALENDAR_STRINGS.DRAWER.TITLE_LABEL}
            </Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder={CALENDAR_STRINGS.DRAWER.TITLE_PLACEHOLDER}
              className="bg-(--neutral-bg-base) border-(--neutral-border-main)"
              maxLength={255}
            />
            {errors.title && (
              <p className="text-xs text-(--brand-accent01-shade-3)">
                {errors.title}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label
              htmlFor="post-content"
              className="text-sm font-medium text-(--neutral-text-secondary)"
            >
              {CALENDAR_STRINGS.DRAWER.CONTENT_LABEL}
            </Label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setContent(e.target.value);
                setErrors((prev) => ({ ...prev, content: undefined }));
              }}
              placeholder={CALENDAR_STRINGS.DRAWER.CONTENT_PLACEHOLDER}
              className="bg-(--neutral-bg-base) border-(--neutral-border-main) min-h-28 resize-none"
              maxLength={10000}
            />
            {errors.content && (
              <p className="text-xs text-(--brand-accent01-shade-3)">
                {errors.content}
              </p>
            )}
          </div>

          {/* Channels */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-(--neutral-text-secondary)">
              {CALENDAR_STRINGS.DRAWER.CHANNELS_LABEL}
            </Label>
            <p className="text-xs text-(--neutral-text-disabled)">
              {CALENDAR_STRINGS.DRAWER.CHANNELS_HINT}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {ALL_PLATFORMS.map((platform) => {
                const config = PLATFORM_CONFIG[platform];
                const Icon = config.icon;
                const isSelected = selectedChannels.includes(platform);

                return (
                  <label
                    key={platform}
                    className={`
                      flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors
                      border
                      ${
                        isSelected
                          ? "border-(--brand-primary-main) bg-(--brand-primary-opacity-12)"
                          : "border-(--neutral-border-main) hover:bg-(--state-overlay-hover)"
                      }
                    `}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleChannelToggle(platform)}
                      className="data-[state=checked]:bg-(--brand-primary-main) data-[state=checked]:border-(--brand-primary-main)"
                    />
                    <Icon size={18} color={`var(${config.colorVar})`} />
                    <span className="text-sm text-(--neutral-text-primary)">
                      {config.label}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.channels && (
              <p className="text-xs text-(--brand-accent01-shade-3)">
                {errors.channels}
              </p>
            )}
          </div>

          {/* Scheduled Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-(--neutral-text-secondary)">
                {CALENDAR_STRINGS.DRAWER.SCHEDULED_DATE_LABEL}
              </Label>
              <Popover
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal bg-(--neutral-bg-base) border-(--neutral-border-main) ${
                      !scheduledDate ? "text-(--neutral-text-disabled)" : ""
                    }`}
                  >
                    {scheduledDate
                      ? format(scheduledDate, "MMM dd, yyyy")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-(--neutral-bg-base) border-(--neutral-border-main)"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={(date) => {
                      setScheduledDate(date);
                      setIsDatePickerOpen(false);
                      setErrors((prev) => ({ ...prev, date: undefined }));
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-xs text-(--brand-accent01-shade-3)">
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label
                htmlFor="post-time"
                className="text-sm font-medium text-(--neutral-text-secondary)"
              >
                {CALENDAR_STRINGS.DRAWER.SCHEDULED_TIME_LABEL}
              </Label>
              <Input
                id="post-time"
                type="time"
                value={scheduledTime}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setScheduledTime(e.target.value);
                  setErrors((prev) => ({ ...prev, time: undefined }));
                }}
                className="bg-(--neutral-bg-base) border-(--neutral-border-main)"
              />
              {errors.time && (
                <p className="text-xs text-(--brand-accent01-shade-3)">
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-(--neutral-text-secondary)">
              {CALENDAR_STRINGS.DRAWER.FILE_LABEL}
            </Label>
            <p className="text-xs text-(--neutral-text-disabled)">
              {CALENDAR_STRINGS.DRAWER.FILE_HINT}
            </p>

            {/* File Preview or Upload */}
            {file || filePreview ? (
              <div className="relative border border-(--neutral-border-main) rounded-md p-3 bg-(--neutral-bg-surface)">
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-1 rounded-full bg-(--neutral-bg-base) hover:bg-(--state-overlay-hover) transition-colors"
                >
                  <X className="size-4 text-(--neutral-text-secondary)" />
                </button>
                {filePreview && filePreview.startsWith("data:image") ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-32 rounded-md object-contain mx-auto"
                  />
                ) : filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-32 rounded-md object-contain mx-auto"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <FileIcon className="size-5 text-(--neutral-text-secondary)" />
                    <span className="text-sm text-(--neutral-text-primary) truncate">
                      {file?.name}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 p-6 border border-dashed border-(--neutral-border-main) rounded-md cursor-pointer hover:bg-(--state-overlay-hover) transition-colors">
                <Upload className="size-6 text-(--neutral-text-secondary)" />
                <span className="text-sm text-(--neutral-text-secondary)">
                  Click to upload
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.mp4,.mov"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>

        <SheetFooter className="border-t border-(--neutral-border-main) p-6 pt-4 flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isSubmitting}
          >
            {CALENDAR_STRINGS.DRAWER.CANCEL}
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-(--brand-primary-main) text-(--neutral-bg-base) hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {CALENDAR_STRINGS.DRAWER.SUBMITTING}
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
