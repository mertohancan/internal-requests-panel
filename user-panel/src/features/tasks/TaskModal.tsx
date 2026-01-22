import React from "react";
import styles from "./TaskModal.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const TaskModal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">×</button>
        {children}
      </div>
    </div>
  );
};

export default TaskModal;
