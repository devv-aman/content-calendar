import { Home, Calendar, type LucideIcon } from "lucide-react";
import { APP_STRINGS } from "./strings";

export const ROUTES = {
  HOME: "/",
  SCHEDULE: "/schedule",
} as const;

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    path: ROUTES.HOME,
    label: APP_STRINGS.NAV.HOME,
    icon: Home,
  },
  {
    path: ROUTES.SCHEDULE,
    label: APP_STRINGS.NAV.SCHEDULE,
    icon: Calendar,
  },
];

export const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case ROUTES.HOME:
      return APP_STRINGS.PAGES.HOME.TITLE;
    case ROUTES.SCHEDULE:
      return APP_STRINGS.PAGES.SCHEDULE.TITLE;
    default:
      return APP_STRINGS.APP_NAME;
  }
};
