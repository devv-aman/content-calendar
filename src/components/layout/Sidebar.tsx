import { useEffect, useCallback } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { X, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/useSidebar";
import { NAV_ITEMS, ROUTES } from "@/constants/routes";
import { APP_STRINGS } from "@/constants/strings";
import { cn } from "@/lib/utils";

const DESKTOP_BREAKPOINT = 1024;

export function Sidebar() {
  const { isOpen, close, toggle } = useSidebar();
  const location = useLocation();

  // Auto-close sidebar on navigation (only on mobile)
  const handleNavigationClose = useCallback(() => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      close();
    }
  }, [close]);

  useEffect(() => {
    handleNavigationClose();
  }, [location.pathname, handleNavigationClose]);

  return (
    <>
      {/* Backdrop - only on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-(--state-overlay-active) lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-(--neutral-bg-surface) border-r border-(--neutral-border-main) transition-all duration-300",
          // Controlled by isOpen for both mobile and desktop
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-(--neutral-border-main)">
          <Link
            to={ROUTES.HOME}
            className="text-lg font-semibold text-(--neutral-text-primary) hover:text-(--brand-primary-main) transition-colors"
          >
            {APP_STRINGS.APP_NAME}
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            className="text-(--neutral-text-secondary) hover:text-(--neutral-text-primary)"
            aria-label={APP_STRINGS.SIDEBAR.TOGGLE_LABEL}
          >
            {/* Show X on mobile, PanelLeftClose on desktop */}
            <X className="size-5 lg:hidden" />
            <PanelLeftClose className="size-5 hidden lg:block" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-(--neutral-text-secondary) hover:bg-(--state-overlay-hover)",
                      isActive &&
                        "bg-(--brand-primary-opacity-12) text-(--brand-primary-main)"
                    )
                  }
                >
                  <item.icon className="size-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Spacer - takes up space in the layout when sidebar is open on desktop */}
      <div
        className={cn(
          "hidden lg:block shrink-0 transition-all duration-300",
          isOpen ? "w-64" : "w-0"
        )}
      />
    </>
  );
}
