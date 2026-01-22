import React from "react";
import Badge from "../Badge";
import { theme } from "../../theme";

const statusColors = {
  pending: theme.colors.status.pending,
  approved: theme.colors.status.approved,
  rejected: theme.colors.status.rejected,
};

const StatusBadge: React.FC<{
  status: "pending" | "approved" | "rejected";
}> = ({ status }) => (
  <Badge color={statusColors[status]}>
    {status === "pending"
      ? "Bekliyor"
      : status === "approved"
        ? "Onaylandı"
        : "Reddedildi"}
  </Badge>
);

export default StatusBadge;
