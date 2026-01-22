import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultTheme, lightTheme, darkTheme, type Theme } from "./theme";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "admin-panel-theme-mode";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = defaultTheme,
}) => {
  // Load theme from localStorage on mount
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode === "dark") {
        return darkTheme;
      } else if (savedMode === "light") {
        return lightTheme;
      }
    } catch (error) {
      // Silent fail
    }
    return initialTheme;
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme.mode);
    } catch (error) {
      // Silent fail
    }
  }, [theme.mode]);

  useEffect(() => {
    // Apply CSS variables to :root
    const root = document.documentElement;

    // Set theme mode class
    root.setAttribute("data-theme", theme.mode);

    // Primary colors
    Object.entries(theme.colors.primary).forEach(([shade, color]) => {
      root.style.setProperty(`--color-primary-${shade}`, color);
    });

    // Background colors
    Object.entries(theme.colors.background).forEach(([key, color]) => {
      root.style.setProperty(`--bg-${key}`, color);
    });

    // Text colors
    Object.entries(theme.colors.text).forEach(([key, color]) => {
      root.style.setProperty(`--text-${key}`, color);
    });

    // Border colors
    Object.entries(theme.colors.border).forEach(([key, color]) => {
      root.style.setProperty(`--border-${key}`, color);
    });

    // Status colors
    Object.entries(theme.colors.success).forEach(([shade, color]) => {
      root.style.setProperty(`--color-success-${shade}`, color);
    });
    Object.entries(theme.colors.warning).forEach(([shade, color]) => {
      root.style.setProperty(`--color-warning-${shade}`, color);
    });
    Object.entries(theme.colors.error).forEach(([shade, color]) => {
      root.style.setProperty(`--color-error-${shade}`, color);
    });

    // Sidebar colors
    Object.entries(theme.colors.sidebar).forEach(([key, color]) => {
      root.style.setProperty(
        `--sidebar-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        color,
      );
    });

    // Spacing
    Object.entries(theme.spacing).forEach(([size, value]) => {
      root.style.setProperty(`--spacing-${size}`, value);
    });

    // Border radius
    Object.entries(theme.borderRadius).forEach(([size, value]) => {
      root.style.setProperty(`--radius-${size}`, value);
    });

    // Shadows
    Object.entries(theme.shadows).forEach(([size, value]) => {
      root.style.setProperty(`--shadow-${size}`, value);
    });

    // Transitions
    Object.entries(theme.transitions).forEach(([speed, value]) => {
      root.style.setProperty(`--transition-${speed}`, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
