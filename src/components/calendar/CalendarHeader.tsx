import { useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import type { DateRange as DayPickerDateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CALENDAR_STRINGS,
  PLATFORM_CONFIG,
  ALL_PLATFORMS,
} from "./calendar.constants";
import type { PostChannel, ViewMode, DateRange } from "./calendar.types";

interface CalendarHeaderProps {
  selectedChannel: PostChannel | "all";
  onChannelChange: (channel: PostChannel | "all") => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onAddNew: () => void;
}

export function CalendarHeader({
  selectedChannel,
  onChannelChange,
  viewMode,
  onViewModeChange,
  dateRange,
  onDateRangeChange,
  onAddNew,
}: CalendarHeaderProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DayPickerDateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to,
  });

  const formatDateRange = (range: DateRange) => {
    return `${format(range.from, "dd MMM, yyyy")} - ${format(
      range.to,
      "dd MMM, yyyy"
    )}`;
  };

  const handleDateSelect = (range: DayPickerDateRange | undefined) => {
    setTempRange(range);
    // Only close and update when both dates are selected
    if (range?.from && range?.to) {
      onDateRangeChange({ from: range.from, to: range.to });
      setIsDatePickerOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDatePickerOpen(open);
    // Reset temp range when opening
    if (open) {
      setTempRange({ from: dateRange.from, to: dateRange.to });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 pb-4 border-b border-(--neutral-border-main)">
      {/* Channel Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-(--neutral-text-secondary) font-medium">
          {CALENDAR_STRINGS.HEADER.CHANNEL_LABEL}
        </label>
        <Select
          value={selectedChannel}
          onValueChange={(value) =>
            onChannelChange(value as PostChannel | "all")
          }
        >
          <SelectTrigger className="w-40 bg-(--neutral-bg-base) border-(--neutral-border-main)">
            <SelectValue placeholder={CALENDAR_STRINGS.HEADER.CHANNEL_ALL} />
          </SelectTrigger>
          <SelectContent className="bg-(--neutral-bg-base) border-(--neutral-border-main)">
            <SelectItem
              value="all"
              className="hover:bg-(--state-overlay-hover)"
            >
              {CALENDAR_STRINGS.HEADER.CHANNEL_ALL}
            </SelectItem>
            {ALL_PLATFORMS.map((platform) => {
              const config = PLATFORM_CONFIG[platform];
              const Icon = config.icon;
              return (
                <SelectItem
                  key={platform}
                  value={platform}
                  className="hover:bg-(--state-overlay-hover)"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} color={`var(${config.colorVar})`} />
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Week/Month Toggle */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-(--neutral-text-secondary) font-medium">
          {CALENDAR_STRINGS.HEADER.VIEW_WEEK}/
          {CALENDAR_STRINGS.HEADER.VIEW_MONTH}
        </label>
        <div className="flex items-center rounded-md border border-(--neutral-border-main) overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("week")}
            className={`rounded-none px-4 ${
              viewMode === "week"
                ? "bg-(--brand-primary-main) text-(--neutral-bg-base) hover:bg-(--brand-primary-main) hover:text-(--neutral-bg-base)"
                : "bg-(--neutral-bg-base) text-(--neutral-text-primary)"
            }`}
          >
            <CalendarIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("month")}
            className={`rounded-none px-4 ${
              viewMode === "month"
                ? "bg-(--brand-primary-main) text-(--neutral-bg-base) hover:bg-(--brand-primary-main) hover:text-(--neutral-bg-base)"
                : "bg-(--neutral-bg-base) text-(--neutral-text-primary)"
            }`}
          >
            <CalendarIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-(--neutral-text-secondary) font-medium">
          {CALENDAR_STRINGS.HEADER.DATE_RANGE_LABEL}
        </label>
        <Popover open={isDatePickerOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-64 justify-start text-left font-normal bg-(--neutral-bg-base) border-(--neutral-border-main) text-(--neutral-text-primary)"
            >
              <span>{formatDateRange(dateRange)}</span>
              <CalendarIcon className="ml-auto size-4 text-(--neutral-text-secondary)" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-(--neutral-bg-base) border-(--neutral-border-main)"
            align="start"
          >
            <Calendar
              mode="range"
              defaultMonth={dateRange.from}
              selected={tempRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Add New Button - Hidden on mobile, shown in MonthTitle row */}
      <Button
        onClick={onAddNew}
        className="hidden lg:flex bg-(--brand-primary-main) text-(--neutral-bg-base) hover:opacity-90"
      >
        <Plus className="size-4" />
        {CALENDAR_STRINGS.HEADER.ADD_NEW}
      </Button>
    </div>
  );
}
