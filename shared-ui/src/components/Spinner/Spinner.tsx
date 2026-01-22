import React from "react";
import { theme } from "../../theme";

const Spinner: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "2em",
    }}
  >
    <div
      style={{
        width: 24,
        height: 24,
        border: `3px solid ${theme.colors.gray[200]}`,
        borderTop: `3px solid ${theme.colors.primary[500]}`,
        borderRadius: theme.borderRadius.full,
        animation: "spin 1s linear infinite",
      }}
    />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;
