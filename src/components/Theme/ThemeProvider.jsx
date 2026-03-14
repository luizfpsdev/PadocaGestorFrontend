import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { s } from "framer-motion/client";

const darkTheme = {
  bg: "#07090f",
  surface: "#0e1117",
  border: "#1c2333",
  border2: "#252d3d",
  text: "#e2e8f0",
  muted: "#64748b",
  dim: "#334155",
  green: "#10b981",
  teal: "#f97316",
  amber: "#f59e0b",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  blue: "#3b82f6",
  overlay: "rgba(0,0,0,.82)",
  shadow: "0 24px 80px rgba(0,0,0,.6)",
  hover: "0 8px 32px rgba(249,115,22,0.12)",
};

const lightTheme = {
  bg: "#f4f7fb",
  surface: "#ffffff",
  border: "#e2e8f0",
  border2: "#cbd5e1",
  text: "#0f172a",
  muted: "#64748b",
  dim: "#94a3b8",
  green: "#059669",
  teal: "#ea580c",
  amber: "#d97706",
  rose: "#e11d48",
  violet: "#7c3aed",
  blue: "#2563eb",
  overlay: "rgba(15,23,42,.4)",
  shadow: "0 20px 60px rgba(15,23,42,.18)",
  hover: "0 8px 30px rgba(234,88,12,.18)",
};

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    window.localStorage.setItem(
      "darkMode",
      darkMode === true ? "false" : "true",
    );
  };

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const storedDarkMode = window.localStorage.getItem("darkMode");

    if (storedDarkMode === "true") {
      setDarkMode(storedDarkMode === "true");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
