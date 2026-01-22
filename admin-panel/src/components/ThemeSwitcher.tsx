import React from "react";
import { useTheme } from "../styles/ThemeProvider";
import { lightTheme, darkTheme } from "../styles/theme";
import styles from "./ThemeSwitcher.module.scss";

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme.mode === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? lightTheme : darkTheme);
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className={styles.icon}>{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
};

export default ThemeSwitcher;
