import { useAuth } from "@/hooks/useAuth";
import { APP_STRINGS } from "@/constants/strings";

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-10rem)]">
      <h1 className="text-4xl font-bold text-(--neutral-text-primary) mb-4">
        {APP_STRINGS.PAGES.DASHBOARD.TITLE}
      </h1>
      {user && (
        <p className="text-lg text-(--neutral-text-secondary)">
          {APP_STRINGS.PAGES.DASHBOARD.WELCOME_MESSAGE.replace(
            "{name}",
            user.name
          )}
        </p>
      )}
    </div>
  );
}
