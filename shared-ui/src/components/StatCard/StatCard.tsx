import React from "react";
import { theme } from "../../theme";

interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color = theme.colors.primary[500],
  icon,
}) => (
  <div
    style={{
      background: "#fff",
      border: `1px solid ${theme.colors.gray[200]}`,
      borderRadius: theme.borderRadius.lg,
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      boxShadow: theme.shadows.sm,
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing.sm,
      minWidth: 160,
      transition: theme.transitions.base,
    }}
  >
    {icon && (
      <div style={{ color, fontSize: theme.typography.fontSize["2xl"] }}>
        {icon}
      </div>
    )}
    <span
      style={{
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.gray[600],
        fontWeight: theme.typography.fontWeight.medium,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "28px",
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.gray[800],
      }}
    >
      {value}
    </span>
  </div>
);

export default StatCard;
