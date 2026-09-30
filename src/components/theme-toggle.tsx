import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function initialTheme(): Theme {
  if (typeof document !== "undefined") {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }
  return "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try { window.localStorage.setItem("theme", theme); } catch { /* storage may be disabled */ }
  }, [theme]);

  return { theme, toggle: () => setTheme(current => current === "dark" ? "light" : "dark") };
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="suite-theme" title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
      {theme === "dark" ? <Sun aria-hidden="true" size={19} /> : <Moon aria-hidden="true" size={19} />}
    </button>
  );
}
