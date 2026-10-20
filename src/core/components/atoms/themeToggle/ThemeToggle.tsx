import { useTheme } from "@features/theme/context/ThemeContext.tsx";
import { MoonIcon, SunIcon } from "@atoms/icons/Icons.tsx";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink hover:border-accent-lilac hover:text-accent-lilac"
    >
      {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
}
