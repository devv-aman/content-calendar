import { createContext, useEffect, useState, type ReactNode } from "react";
import { APP_STRINGS } from "@/constants/strings";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const THEME_STORAGE_KEY = "content-calendar-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return APP_STRINGS.THEME.LIGHT as Theme;
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (
    storedTheme === APP_STRINGS.THEME.LIGHT ||
    storedTheme === APP_STRINGS.THEME.DARK
  ) {
    return storedTheme as Theme;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark
    ? (APP_STRINGS.THEME.DARK as Theme)
    : (APP_STRINGS.THEME.LIGHT as Theme);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === APP_STRINGS.THEME.DARK) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) =>
      prev === APP_STRINGS.THEME.LIGHT
        ? (APP_STRINGS.THEME.DARK as Theme)
        : (APP_STRINGS.THEME.LIGHT as Theme)
    );
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
