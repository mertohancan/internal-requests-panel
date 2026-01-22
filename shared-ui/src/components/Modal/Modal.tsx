import React from "react";
import { theme } from "../../theme";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: theme.zIndex.modal,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          minWidth: 400,
          maxWidth: 600,
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          boxShadow: theme.shadows.xl,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2
            style={{
              marginTop: 0,
              marginBottom: theme.spacing.lg,
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.gray[800],
            }}
          >
            {title}
          </h2>
        )}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: theme.spacing.md,
            right: theme.spacing.md,
            background: "transparent",
            border: "none",
            fontSize: theme.typography.fontSize["2xl"],
            cursor: "pointer",
            color: theme.colors.gray[600],
            lineHeight: 1,
          }}
          aria-label="Kapat"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
