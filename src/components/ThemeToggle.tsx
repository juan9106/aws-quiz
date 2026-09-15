import { useTheme } from "../hooks/useTheme";
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Dark mode"
      onClick={toggleTheme}
    >
      Dark mode: {theme === "dark" ? "On" : "Off"}
    </button>
  );
}
