import React from "react";
import { theme } from "../../theme";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: `${theme.spacing["2xl"]} ${theme.spacing.lg}`,
      textAlign: "center",
    }}
  >
    {icon && (
      <div
        style={{
          fontSize: theme.typography.fontSize["4xl"],
          color: theme.colors.gray[300],
          marginBottom: theme.spacing.md,
        }}
      >
        {icon}
      </div>
    )}
    <h3
      style={{
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.gray[800],
        marginBottom: theme.spacing.sm,
      }}
    >
      {title}
    </h3>
    {description && (
      <p
        style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.gray[600],
          marginBottom: theme.spacing.md,
          maxWidth: 400,
        }}
      >
        {description}
      </p>
    )}
    {action && <div>{action}</div>}
  </div>
);

export default EmptyState;
