// Admin Panel Theme Configuration

export type ThemeMode = "light" | "dark";

export interface Theme {
  mode: ThemeMode;
  colors: {
    // Primary brand color
    primary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    // Background colors
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      elevated: string;
    };
    // Text colors
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverted: string;
    };
    // Border colors
    border: {
      light: string;
      medium: string;
      dark: string;
    };
    // Status colors
    success: {
      500: string;
      600: string;
      700: string;
    };
    warning: {
      500: string;
      600: string;
      700: string;
    };
    error: {
      500: string;
      600: string;
      700: string;
    };
    // Sidebar specific
    sidebar: {
      background: string;
      text: string;
      textMuted: string;
      textHover: string;
      itemHover: string;
      itemActive: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    base: string;
    slow: string;
  };
}

// Light Theme
export const lightTheme: Theme = {
  mode: "light",
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    background: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      tertiary: "#f1f5f9",
      elevated: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      muted: "#64748b",
      inverted: "#ffffff",
    },
    border: {
      light: "#e2e8f0",
      medium: "#cbd5e0",
      dark: "#94a3b8",
    },
    success: {
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    warning: {
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
    },
    error: {
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
    },
    sidebar: {
      background: "#1e293b",
      text: "#ffffff",
      textMuted: "#94a3b8",
      textHover: "#cbd5e1",
      itemHover: "rgba(255, 255, 255, 0.05)",
      itemActive: "#3b82f6",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  transitions: {
    fast: "150ms ease-in-out",
    base: "200ms ease-in-out",
    slow: "300ms ease-in-out",
  },
};

// Dark Theme
export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    background: {
      primary: "#0f172a",
      secondary: "#1e293b",
      tertiary: "#334155",
      elevated: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
      muted: "#94a3b8",
      inverted: "#0f172a",
    },
    border: {
      light: "#334155",
      medium: "#475569",
      dark: "#64748b",
    },
    success: {
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    warning: {
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
    },
    error: {
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
    },
    sidebar: {
      background: "#020617",
      text: "#f8fafc",
      textMuted: "#64748b",
      textHover: "#cbd5e1",
      itemHover: "rgba(255, 255, 255, 0.05)",
      itemActive: "#3b82f6",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.6)",
  },
  transitions: {
    fast: "150ms ease-in-out",
    base: "200ms ease-in-out",
    slow: "300ms ease-in-out",
  },
};

export const defaultTheme = lightTheme;
