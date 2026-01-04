import { APP_STRINGS } from "@/constants/strings";

export function Home() {
  return (
    <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
      <h1 className="text-4xl font-bold text-(--neutral-text-primary)">
        {APP_STRINGS.PAGES.HOME.GREETING}
      </h1>
    </div>
  );
}
