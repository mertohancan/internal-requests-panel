import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

import styles from "./DashboardPage.module.scss";
import TaskQuickForm from "./TaskQuickForm";
import type { TaskFormInputs } from "./TaskQuickForm";
import TaskModal from "./TaskModal";
import { useState } from "react";
import { api } from "@/services/api";
import type { Task } from "@/types";

import { StatusBadge, Spinner } from "@task-approval/shared-ui";

const DashboardPage: React.FC = () => {
  const { items, loading, error } = useAppSelector((state) => state.tasks);

  const total = items.length;
  const pending = items.filter((t: Task) => t.status === "pending").length;
  const approved = items.filter((t: Task) => t.status === "approved").length;
  const rejected = items.filter((t: Task) => t.status === "rejected").length;
  const lastTasks = items.slice(0, 5);

  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleQuickTask = async (data: TaskFormInputs) => {
    if (!user) return;
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(false);
    try {
      await api.post("/tasks", {
        ...data,
        status: "pending",
        createdBy: user.id,
        createdAt: new Date().toISOString(),
      });
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 2000);
      // Don't manually fetch - socket event will update automatically
      setModalOpen(false);
    } catch (err) {
      setFormError("Kayıt sırasında hata oluştu.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles.header}>
        <div className={styles["title-section"]}>
          <h2>Dashboard</h2>
          <p className={styles.subtitle}>Hoş geldiniz, {user?.email}</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className={styles["action-btn"]}
        >
          <span>+</span>
          Hızlı Talep
        </button>
      </div>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <TaskQuickForm
          onSubmit={handleQuickTask}
          loading={formLoading}
          success={formSuccess}
          error={formError}
        />
      </TaskModal>

      {loading && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "3rem" }}
        >
          <Spinner />
        </div>
      )}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "1rem",
            borderRadius: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      <div className={styles.summary}>
        <div className={styles["summary-box"]}>
          <span className={styles.label}>Toplam</span>
          <span className={`${styles.value} ${styles.total}`}>{total}</span>
        </div>
        <div className={styles["summary-box"]}>
          <span className={styles.label}>Bekleyen</span>
          <span className={`${styles.value} ${styles.pending}`}>{pending}</span>
        </div>
        <div className={styles["summary-box"]}>
          <span className={styles.label}>Onaylanan</span>
          <span className={`${styles.value} ${styles.approved}`}>
            {approved}
          </span>
        </div>
        <div className={styles["summary-box"]}>
          <span className={styles.label}>Reddedilen</span>
          <span className={`${styles.value} ${styles.rejected}`}>
            {rejected}
          </span>
        </div>
      </div>

      <div className={styles["last-tasks"]}>
        <h3>Son Talepler</h3>
        {lastTasks.length === 0 ? (
          <div className={styles["empty-state"]}>Henüz talep bulunmuyor</div>
        ) : (
          <ul>
            {lastTasks.map((task: any) => (
              <li key={task.id}>
                <div className={styles["task-info"]}>
                  <div className={styles["task-title"]}>{task.title}</div>
                  <div className={styles["task-date"]}>
                    {new Date(task.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </div>
                <StatusBadge status={task.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
