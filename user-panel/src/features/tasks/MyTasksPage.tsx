import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchTasks } from "@/features/tasks/tasksSlice";
import {
  StatusBadge,
  PriorityBadge,
  Spinner,
  Table,
} from "@task-approval/shared-ui";
import type { Column } from "@task-approval/shared-ui";
import styles from "./MyTasksPage.module.scss";
import type { Task } from "@/types";

const statusLabels: Record<string, string> = {
  all: "Tümü",
  pending: "Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

const MyTasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.tasks);
  const user = useAppSelector((state) => state.auth.user);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Reset page when filter changes
  const handleFilterChange = (
    newFilter: "all" | "pending" | "approved" | "rejected",
  ) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  if (!user) return <div>Oturum bulunamadı.</div>;

  const filtered = items.filter(
    (t) => t.createdBy === user.id && (filter === "all" || t.status === filter),
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filtered.slice(startIndex, startIndex + itemsPerPage);

  const selectedTask = filtered.find((t) => t.id === selectedTaskId);

  const columns: Column<Task>[] = [
    {
      key: "title",
      header: "Başlık",
      render: (task) => <span style={{ fontWeight: 500 }}>{task.title}</span>,
    },
    {
      key: "priority",
      header: "Öncelik",
      render: (task) => <PriorityBadge priority={task.priority} />,
      width: "120px",
    },
    {
      key: "status",
      header: "Durum",
      render: (task) => <StatusBadge status={task.status} />,
      width: "120px",
    },
    {
      key: "createdAt",
      header: "Oluşturulma",
      render: (task) =>
        new Date(task.createdAt).toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      width: "180px",
    },
    {
      key: "actions",
      header: "İşlem",
      render: (task) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTaskId(task.id);
          }}
          className={styles["view-btn"]}
        >
          Görüntüle
        </button>
      ),
      width: "100px",
      align: "center",
    },
  ];

  return (
    <div className={styles["my-tasks-container"]}>
      <div className={styles["page-header"]}>
        <h2>Taleplerim</h2>
        <p className={styles.subtitle}>
          Oluşturduğunuz talepleri görüntüleyin ve takip edin
        </p>
      </div>

      <div className={styles["filter-tabs"]}>
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() =>
              handleFilterChange(
                key as "all" | "pending" | "approved" | "rejected",
              )
            }
            disabled={filter === key}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles["loading-wrapper"]}>
          <Spinner />
        </div>
      )}

      {error && <div className={styles["error-message"]}>{error}</div>}

      <div className={styles["tasks-table"]}>
        <Table
          columns={columns}
          data={paginatedTasks}
          keyExtractor={(task) => task.id}
          emptyMessage={
            filter === "all"
              ? "Henüz talep oluşturmadınız"
              : `${statusLabels[filter]} talep bulunmuyor`
          }
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
            itemsPerPage,
            showInfo: true,
          }}
        />
      </div>

      {selectedTask && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setSelectedTaskId(null)}
        >
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedTask.title}</h3>

            <div className={styles["detail-row"]}>
              <span className={styles.label}>Açıklama</span>
              <div className={styles.value}>{selectedTask.description}</div>
            </div>

            <div className={styles["detail-row"]}>
              <span className={styles.label}>Öncelik</span>
              <div className={styles.value}>
                <PriorityBadge priority={selectedTask.priority} />
              </div>
            </div>

            <div className={styles["detail-row"]}>
              <span className={styles.label}>Kategori</span>
              <div className={styles.value}>{selectedTask.category}</div>
            </div>

            <div className={styles["detail-row"]}>
              <span className={styles.label}>Durum</span>
              <div className={styles.value}>
                <StatusBadge status={selectedTask.status} />
              </div>
            </div>

            <div className={styles["detail-row"]}>
              <span className={styles.label}>Oluşturulma Tarihi</span>
              <div className={styles.value}>
                {new Date(selectedTask.createdAt).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {selectedTask.status === "rejected" && (
              <div className={styles["rejection-reason"]}>
                <span className={styles.label}>Red Sebebi</span>
                <div className={styles.value}>
                  {selectedTask.rejectionReason || "Sebep belirtilmedi"}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedTaskId(null)}
              className={styles["close-btn"]}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasksPage;
