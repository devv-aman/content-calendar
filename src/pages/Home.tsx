import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StarBackground } from "@/components/auth";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { APP_STRINGS } from "@/constants/strings";
import { ROUTES } from "@/constants/routes";
import { ArrowRight } from "lucide-react";

export function Home() {
  return (
    <div className="relative min-h-screen bg-(--neutral-bg-base) overflow-hidden">
      {/* Star Background */}
      <StarBackground />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold text-(--neutral-text-primary)">
          {APP_STRINGS.APP_NAME}
        </span>
        <div className="flex items-center gap-3">
          <Link to={ROUTES.AUTH}>
            <Button variant="ghost" size="sm">
              {APP_STRINGS.NAV.LOGIN}
            </Button>
          </Link>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-(--neutral-text-primary) leading-tight mb-6">
            {APP_STRINGS.PAGES.HOME.HERO_TITLE}
            <br />
            <span className="text-(--brand-primary-main)">
              {APP_STRINGS.PAGES.HOME.HERO_TITLE_HIGHLIGHT}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-(--neutral-text-secondary) max-w-2xl mx-auto mb-10 leading-relaxed">
            {APP_STRINGS.PAGES.HOME.HERO_SUBTITLE}
          </p>
          <Link to={ROUTES.AUTH}>
            <Button size="lg" className="gap-2 text-base px-8">
              {APP_STRINGS.PAGES.HOME.CTA_BUTTON}
              <ArrowRight className="size-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
