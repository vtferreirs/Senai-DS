import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import "./ThemeToggle.css";

export default function ThemeToggle({ floating = false }) {
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("taskvibe-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      className={`theme-toggle ${floating ? "theme-toggle--floating" : ""}`}
      onClick={toggle}
      title={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-label="Alternar tema claro/escuro"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      <span className="theme-toggle-label">
        {theme === "dark" ? "Claro" : "Escuro"}
      </span>
    </button>
  );
}