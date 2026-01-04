import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { StarBackground, AuthForm } from "@/components/auth";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { APP_STRINGS } from "@/constants/strings";
import { ROUTES } from "@/constants/routes";
import { Loader2 } from "lucide-react";

export function Auth() {
  const { isAuthenticated, isLoading } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-(--neutral-bg-base)">
        <Loader2 className="size-8 animate-spin text-(--brand-primary-main)" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="relative min-h-screen bg-(--neutral-bg-base) overflow-hidden">
      {/* Star Background */}
      <StarBackground />

      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher />
      </div>

      {/* Logo/App Name */}
      <div className="absolute top-4 left-4 z-20">
        <span className="text-lg font-semibold text-(--neutral-text-primary)">
          {APP_STRINGS.APP_NAME}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <AuthForm />
      </div>
    </div>
  );
}
