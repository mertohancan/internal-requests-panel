import React from "react";
import Badge from "../Badge";
import { theme } from "../../theme";

const priorityColors = {
  low: theme.colors.priority.low,
  normal: theme.colors.priority.normal,
  high: theme.colors.priority.high,
  urgent: theme.colors.priority.urgent,
};

const priorityLabels: Record<string, string> = {
  low: "Düşük",
  normal: "Normal",
  high: "Yüksek",
  urgent: "Acil",
};

const PriorityBadge: React.FC<{
  priority: "low" | "normal" | "high" | "urgent";
}> = ({ priority }) => (
  <Badge color={priorityColors[priority]}>{priorityLabels[priority]}</Badge>
);

export default PriorityBadge;
