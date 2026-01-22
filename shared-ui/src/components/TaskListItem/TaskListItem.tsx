import React from "react";
import { theme } from "../../theme";

interface TaskListItemProps {
  title: string;
  status: "pending" | "approved" | "rejected";
  priority?: "low" | "normal" | "high" | "urgent";
  createdAt?: string;
  onClick?: () => void;
  badge?: React.ReactNode;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  title,
  // status and priority can be used for styling later
  createdAt,
  onClick,
  badge,
}) => (
  <li
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      background: "#fff",
      border: `1px solid ${theme.colors.gray[200]}`,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      cursor: onClick ? "pointer" : "default",
      transition: `all ${theme.transitions.base}`,
    }}
    onClick={onClick}
    onMouseEnter={(e) =>
      onClick && (e.currentTarget.style.background = theme.colors.gray[50])
    }
    onMouseLeave={(e) => onClick && (e.currentTarget.style.background = "#fff")}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.xs,
        flex: 1,
      }}
    >
      <span
        style={{
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.gray[800],
        }}
      >
        {title}
      </span>
      {createdAt && (
        <span
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.gray[500],
          }}
        >
          {new Date(createdAt).toLocaleDateString("tr-TR")}
        </span>
      )}
    </div>
    <div
      style={{ display: "flex", gap: theme.spacing.sm, alignItems: "center" }}
    >
      {badge}
    </div>
  </li>
);

export default TaskListItem;
