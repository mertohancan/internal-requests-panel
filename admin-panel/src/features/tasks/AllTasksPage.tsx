import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchTasks } from "@/features/tasks/tasksSlice";
import {
  Spinner,
  StatusBadge,
  PriorityBadge,
  EmptyState,
  Table,
} from "@task-approval/shared-ui";
import type { Column } from "@task-approval/shared-ui";
import styles from "./AllTasksPage.module.scss";
import type { Priority, TaskStatus, Task } from "@/services/types";

export type { Priority, TaskStatus };

const AllTasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.tasks);
  const [filter, setFilter] = useState<{
    status?: TaskStatus;
    priority?: Priority;
    date?: string;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filtered = items.filter(
    (t) =>
      (!filter.status || t.status === filter.status) &&
      (!filter.priority || t.priority === filter.priority) &&
      (!filter.date || t.createdAt.slice(0, 10) === filter.date),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: string, value?: string) => {
    setFilter((f) => ({ ...f, [key]: value }));
    setCurrentPage(1);
  };

  const columns: Column<Task>[] = [
    {
      key: "title",
      header: "Başlık",
      render: (task: Task) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: "0.25rem" }}>
            {task.title}
          </div>
          {task.rejectionReason && (
            <div
              style={{
                fontSize: "0.8125rem",
                color: "#dc2626",
                marginTop: "0.25rem",
              }}
            >
              Red Sebebi: {task.rejectionReason}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "createdBy",
      header: "Talep Sahibi",
      render: (task: Task) => task.createdBy,
      width: "140px",
    },
    {
      key: "priority",
      header: "Öncelik",
      render: (task: Task) => <PriorityBadge priority={task.priority} />,
      width: "100px",
    },
    {
      key: "category",
      header: "Kategori",
      render: (task: Task) => task.category,
      width: "130px",
    },
    {
      key: "createdAt",
      header: "Tarih",
      render: (task: Task) => new Date(task.createdAt).toLocaleString("tr-TR"),
      width: "160px",
    },
    {
      key: "status",
      header: "Durum",
      render: (task: Task) => <StatusBadge status={task.status} />,
      width: "100px",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles["page-header"]}>
        <div>
          <h1 className={styles["page-title"]}>Tüm Talepler</h1>
          <p className={styles["page-subtitle"]}>
            Sistemdeki tüm talepleri görüntüleyin ve filtreleyin
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        <select
          value={filter.status || ""}
          onChange={(e) =>
            handleFilterChange("status", e.target.value || undefined)
          }
        >
          <option value="">Durum (Tümü)</option>
          <option value="pending">Bekliyor</option>
          <option value="approved">Onaylandı</option>
          <option value="rejected">Reddedildi</option>
        </select>
        <select
          value={filter.priority || ""}
          onChange={(e) =>
            handleFilterChange("priority", e.target.value || undefined)
          }
        >
          <option value="">Öncelik (Tümü)</option>
          <option value="low">Düşük</option>
          <option value="normal">Normal</option>
          <option value="high">Yüksek</option>
          <option value="urgent">Acil</option>
        </select>
        <input
          type="date"
          value={filter.date || ""}
          onChange={(e) =>
            handleFilterChange("date", e.target.value || undefined)
          }
        />
      </div>

      {loading && (
        <div className={styles["loading-wrapper"]}>
          <Spinner />
        </div>
      )}
      {error && <div className={styles["error-message"]}>{error}</div>}

      {!loading && filtered.length > 0 && (
        <Table
          columns={columns}
          data={paginatedTasks}
          keyExtractor={(task: Task) => task.id}
          emptyMessage="Talep bulunamadı"
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
            itemsPerPage,
            showInfo: true,
            totalItems: filtered.length,
          }}
        />
      )}

      {!loading && filtered.length === 0 && (
        <EmptyState
          title="Talep bulunamadı"
          description="Seçtiğiniz kriterlere uygun talep bulunmuyor."
        />
      )}
    </div>
  );
};

export default AllTasksPage;
