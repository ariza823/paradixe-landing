import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./ThemeContext.tsx";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    return;
  }
}

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const hasUserChoice = useRef(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (hasUserChoice.current) persistTheme(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    hasUserChoice.current = true;
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    hasUserChoice.current = true;
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const contextValue = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
