import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CALENDAR_STRINGS } from "./calendar.constants";

interface MonthTitleProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

export function MonthTitle({ currentDate, onMonthChange }: MonthTitleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());

  const monthName = CALENDAR_STRINGS.MONTHS[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(displayYear, monthIndex, 1);
    onMonthChange(newDate);
    setIsOpen(false);
  };

  const handlePrevYear = () => {
    setDisplayYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setDisplayYear((prev) => prev + 1);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-2xl font-semibold text-(--neutral-text-primary) hover:bg-(--state-overlay-hover) px-2 py-1 h-auto"
        >
          <span>{monthName}</span>
          <span className="text-(--neutral-text-secondary)">{year}</span>
          <ChevronDown className="size-5 text-(--neutral-text-secondary)" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-4 bg-(--neutral-bg-base) border-(--neutral-border-main)"
        align="start"
      >
        {/* Year Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handlePrevYear}
            className="text-(--neutral-text-secondary) hover:text-(--neutral-text-primary)"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-lg font-semibold text-(--neutral-text-primary)">
            {displayYear}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleNextYear}
            className="text-(--neutral-text-secondary) hover:text-(--neutral-text-primary)"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-3 gap-2">
          {CALENDAR_STRINGS.MONTHS.map((month, index) => {
            const isSelected =
              index === currentDate.getMonth() &&
              displayYear === currentDate.getFullYear();
            return (
              <Button
                key={month}
                variant="ghost"
                size="sm"
                onClick={() => handleMonthSelect(index)}
                className={`
                  text-sm font-medium
                  ${
                    isSelected
                      ? "bg-(--brand-primary-main) text-(--neutral-bg-base) hover:bg-(--brand-primary-main) hover:text-(--neutral-bg-base)"
                      : "text-(--neutral-text-primary) hover:bg-(--state-overlay-hover)"
                  }
                `}
              >
                {month.slice(0, 3)}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
