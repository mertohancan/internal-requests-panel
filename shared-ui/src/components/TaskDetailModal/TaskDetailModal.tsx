import React from "react";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import { theme } from "../../theme";

interface TaskDetailModalProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: "low" | "normal" | "high" | "urgent";
    category: string;
    status: "pending" | "approved" | "rejected";
    createdBy: string;
    createdAt: string;
    rejectionReason?: string;
  } | null;
  onClose: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.5)",
  zIndex: theme.zIndex.modal,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const contentStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: theme.borderRadius["2xl"],
  boxShadow: theme.shadows.xl,
  padding: theme.spacing["2xl"],
  maxWidth: "600px",
  width: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
};

const titleStyle: React.CSSProperties = {
  color: theme.colors.gray[900],
  fontSize: theme.typography.fontSize["2xl"],
  fontWeight: theme.typography.fontWeight.bold,
  margin: `0 0 ${theme.spacing.lg} 0`,
};

const detailRowStyle: React.CSSProperties = {
  marginBottom: theme.spacing.md,
  paddingBottom: theme.spacing.md,
  borderBottom: `1px solid ${theme.colors.gray[200]}`,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: theme.typography.fontSize.xs,
  fontWeight: theme.typography.fontWeight.semibold,
  color: theme.colors.gray[500],
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: theme.spacing.sm,
};

const valueStyle: React.CSSProperties = {
  color: theme.colors.gray[700],
  fontSize: theme.typography.fontSize.base,
  lineHeight: theme.typography.lineHeight.relaxed,
};

const rejectionReasonStyle: React.CSSProperties = {
  background: theme.colors.error[100],
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.lg,
  borderLeft: `4px solid ${theme.colors.error[500]}`,
  marginTop: theme.spacing.md,
};

const rejectionLabelStyle: React.CSSProperties = {
  ...labelStyle,
  color: theme.colors.error[700],
};

const rejectionValueStyle: React.CSSProperties = {
  ...valueStyle,
  color: theme.colors.error[700],
};

const closeBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: theme.spacing.md,
  background: theme.colors.gray[200],
  color: theme.colors.gray[700],
  border: "none",
  borderRadius: theme.borderRadius.lg,
  fontWeight: theme.typography.fontWeight.semibold,
  fontSize: theme.typography.fontSize.base,
  cursor: "pointer",
  marginTop: theme.spacing.lg,
  transition: theme.transitions.base,
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
}) => {
  if (!task) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={titleStyle}>{task.title}</h3>

        <div style={detailRowStyle}>
          <span style={labelStyle}>Açıklama</span>
          <div style={valueStyle}>{task.description}</div>
        </div>

        <div style={detailRowStyle}>
          <span style={labelStyle}>Öncelik</span>
          <div style={valueStyle}>
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        <div style={detailRowStyle}>
          <span style={labelStyle}>Kategori</span>
          <div style={valueStyle}>{task.category}</div>
        </div>

        <div style={detailRowStyle}>
          <span style={labelStyle}>Durum</span>
          <div style={valueStyle}>
            <StatusBadge status={task.status} />
          </div>
        </div>

        <div style={{ ...detailRowStyle, borderBottom: "none" }}>
          <span style={labelStyle}>Oluşturulma Tarihi</span>
          <div style={valueStyle}>
            {new Date(task.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {task.status === "rejected" && task.rejectionReason && (
          <div style={rejectionReasonStyle}>
            <span style={rejectionLabelStyle}>Red Sebebi</span>
            <div style={rejectionValueStyle}>
              {task.rejectionReason || "Sebep belirtilmedi"}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={closeBtnStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.colors.gray[300];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.colors.gray[200];
          }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
};
