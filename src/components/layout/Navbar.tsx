import { useLocation } from "react-router-dom";
import { Menu, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useSidebar } from "@/hooks/useSidebar";
import { getPageTitle } from "@/constants/routes";
import { APP_STRINGS } from "@/constants/strings";

const DICEBEAR_AVATAR_URL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${APP_STRINGS.USER.AVATAR_SEED}`;

export function Navbar() {
  const { isOpen, toggle } = useSidebar();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 h-16 bg-(--neutral-bg-base) border-b border-(--neutral-border-main)">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Menu button and title */}
        <div className="flex items-center gap-4">
          {/* Mobile: always show hamburger menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="lg:hidden text-(--neutral-text-primary)"
            aria-label={APP_STRINGS.SIDEBAR.TOGGLE_LABEL}
          >
            <Menu className="size-5" />
          </Button>
          {/* Desktop: show expand button when sidebar is collapsed */}
          {!isOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="hidden lg:flex text-(--neutral-text-primary)"
              aria-label={APP_STRINGS.SIDEBAR.EXPAND_LABEL}
            >
              <PanelLeft className="size-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-(--neutral-text-primary)">
            {pageTitle}
          </h1>
        </div>

        {/* Right side - Theme switcher and avatar */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Avatar className="size-9">
            <AvatarImage
              src={DICEBEAR_AVATAR_URL}
              alt={APP_STRINGS.USER.DEFAULT_NAME}
            />
            <AvatarFallback>
              {APP_STRINGS.USER.DEFAULT_NAME.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
