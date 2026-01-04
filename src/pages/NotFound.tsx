import { APP_STRINGS } from "@/constants/strings";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-(--neutral-bg-base) gap-4">
      {/* 404 Code with Glitch Effect */}
      <div className="relative">
        <h1
          className="text-9xl font-bold text-(--brand-primary-main) animate-slide-in"
          style={{ animationDelay: "0s" }}
        >
          {APP_STRINGS.PAGES.NOT_FOUND.CODE}
        </h1>
        {/* Glitch layers */}
        <h1
          className="absolute top-0 left-0 text-9xl font-bold text-(--brand-accent01-main) animate-glitch opacity-70"
          aria-hidden="true"
        >
          {APP_STRINGS.PAGES.NOT_FOUND.CODE}
        </h1>
        <h1
          className="absolute top-0 left-0 text-9xl font-bold text-(--brand-secondary-main) animate-glitch-delayed opacity-70"
          aria-hidden="true"
        >
          {APP_STRINGS.PAGES.NOT_FOUND.CODE}
        </h1>
      </div>

      {/* Title with Fade In */}
      <h2
        className="text-2xl font-semibold text-(--neutral-text-primary) animate-fade-in"
        style={{
          animationDelay: "0.3s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        {APP_STRINGS.PAGES.NOT_FOUND.TITLE}
      </h2>

      {/* Description with Fade In */}
      <p
        className="text-base text-(--neutral-text-secondary) animate-fade-in"
        style={{
          animationDelay: "0.5s",
          opacity: 0,
          animationFillMode: "forwards",
        }}
      >
        {APP_STRINGS.PAGES.NOT_FOUND.DESCRIPTION}
      </p>
    </div>
  );
}
