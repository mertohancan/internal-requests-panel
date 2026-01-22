import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchTasks } from "@/features/tasks/tasksSlice";
import { Spinner, StatCard } from "@task-approval/shared-ui";
import styles from "./DashboardPage.module.scss";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const totalTasks = items.length;
  const pending = items.filter((t) => t.status === "pending").length;
  const approved = items.filter((t) => t.status === "approved").length;
  const rejected = items.filter((t) => t.status === "rejected").length;
  const priorityCounts = items.reduce(
    (acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["page-header"]}>
        <h1 className={styles["page-title"]}>Dashboard</h1>
        <p className={styles["page-subtitle"]}>
          Talep yönetimi istatistikleri ve öncelik dağılımı
        </p>
      </div>

      {loading && (
        <div className={styles["loading-wrapper"]}>
          <Spinner />
        </div>
      )}
      {error && <div className={styles["error-message"]}>{error}</div>}

      {!loading && (
        <div className={styles["stats-grid"]}>
          <StatCard label="Toplam Talep" value={totalTasks} color="primary" />
          <StatCard label="Bekleyen" value={pending} color="warning" />
          <StatCard label="Onaylanan" value={approved} color="success" />
          <StatCard label="Reddedilen" value={rejected} color="error" />
          <StatCard
            label="Yüksek Öncelik"
            value={priorityCounts["high"] || 0}
            color="priority-high"
          />
          <StatCard
            label="Orta Öncelik"
            value={priorityCounts["medium"] || 0}
            color="priority-medium"
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
