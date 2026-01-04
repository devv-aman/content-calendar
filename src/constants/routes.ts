import { LayoutDashboard, type LucideIcon } from "lucide-react";
import { APP_STRINGS } from "./strings";

export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
} as const;

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    path: ROUTES.DASHBOARD,
    label: APP_STRINGS.NAV.DASHBOARD,
    icon: LayoutDashboard,
  },
];

export const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case ROUTES.HOME:
      return APP_STRINGS.PAGES.HOME.TITLE;
    case ROUTES.AUTH:
      return APP_STRINGS.PAGES.AUTH.TITLE;
    case ROUTES.DASHBOARD:
      return APP_STRINGS.PAGES.DASHBOARD.TITLE;
    default:
      return APP_STRINGS.APP_NAME;
  }
};
