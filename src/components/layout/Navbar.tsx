import { useLocation, Link, useNavigate } from "react-router-dom";
import { Menu, PanelLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useSidebar } from "@/hooks/useSidebar";
import { useAuth } from "@/hooks/useAuth";
import { getPageTitle, ROUTES } from "@/constants/routes";
import { APP_STRINGS } from "@/constants/strings";

// Generate DiceBear avatar URL using user's email as seed for uniqueness
const getDiceBearAvatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

export function Navbar() {
  const { isOpen, toggle } = useSidebar();
  const { isAuthenticated, user, logout } = useAuth();

  // Use Google avatar if available, otherwise use DiceBear with user email as seed
  const avatarUrl =
    user?.avatar_url ||
    getDiceBearAvatar(user?.email || APP_STRINGS.USER.AVATAR_SEED);
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

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

        {/* Right side - Login/User actions, Theme switcher */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <Link to={ROUTES.AUTH}>
              <Button variant="ghost" size="sm">
                {APP_STRINGS.NAV.LOGIN}
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-(--neutral-text-secondary) hover:text-(--neutral-text-primary)"
              aria-label={APP_STRINGS.USER.LOGOUT}
            >
              <LogOut className="size-5" />
            </Button>
          )}
          <ThemeSwitcher />
          {isAuthenticated && (
            <Avatar className="size-7">
              <AvatarImage
                src={avatarUrl}
                alt={user?.name || APP_STRINGS.USER.DEFAULT_NAME}
              />
              <AvatarFallback>
                {(user?.name || APP_STRINGS.USER.DEFAULT_NAME)
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  );
}
