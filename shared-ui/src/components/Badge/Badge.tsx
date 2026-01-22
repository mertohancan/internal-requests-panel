import React from "react";
import { theme } from "../../theme";

interface BadgeProps {
  color: string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ color, children }) => (
  <span
    style={{
      display: "inline-block",
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.full,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      background: color,
      color: "#fff",
    }}
  >
    {children}
  </span>
);

export default Badge;
