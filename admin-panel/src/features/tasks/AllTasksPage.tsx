import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchTasks, deleteTask } from "@/features/tasks/tasksSlice";
import toast from "react-hot-toast";
import {
  Spinner,
  StatusBadge,
  PriorityBadge,
  EmptyState,
  Table,
  Modal,
  TaskDetailModal,
} from "@task-approval/shared-ui";
import type { Column } from "@task-approval/shared-ui";
import styles from "./AllTasksPage.module.scss";
import type { Priority, TaskStatus, Task } from "@/services/types";

export type { Priority, TaskStatus };

const AllTasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.tasks);
  const user = useAppSelector((state) => state.auth.user);
  const [filter, setFilter] = useState<{
    status?: TaskStatus;
    priority?: Priority;
    date?: string;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteTask(deleteId)).unwrap();
      toast.success("Talep başarıyla silindi");
      setDeleteId(null);
    } catch (error) {
      toast.error(error as string);
    }
  };

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
    {
      key: "actions",
      header: "İşlemler",
      render: (task: Task) => {
        const isAdmin = user?.role === "Admin";
        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTaskId(task.id);
              }}
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.8125rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontWeight: 500,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
              }}
            >
              Görüntüle
            </button>
            <div className={styles.tooltipWrapper}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isAdmin) {
                    setDeleteId(task.id);
                  }
                }}
                disabled={!isAdmin}
                style={{
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.8125rem",
                  backgroundColor: isAdmin ? "#ef4444" : "#9ca3af",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: isAdmin ? "pointer" : "not-allowed",
                  fontWeight: 500,
                  opacity: isAdmin ? 1 : 0.6,
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (isAdmin) {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isAdmin) {
                    e.currentTarget.style.backgroundColor = "#ef4444";
                  }
                }}
              >
                Sil
              </button>
              {!isAdmin && (
                <span className={styles.tooltip}>
                  Yönetici yetkisi gerekmektedir
                </span>
              )}
            </div>
          </div>
        );
      },
      width: "180px",
      align: "center" as const,
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

      {/* Silme Onay Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Talebi Sil"
      >
        <div className={styles["delete-modal"]}>
          <p className={styles.message}>
            Bu talebi silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </p>
          <div className={styles["modal-actions"]}>
            <button
              onClick={() => setDeleteId(null)}
              className={styles["cancel-btn"]}
            >
              İptal
            </button>
            <button
              onClick={handleDelete}
              className={styles["delete-confirm-btn"]}
            >
              Sil
            </button>
          </div>
        </div>
      </Modal>

      {/* Talep Detay Modal */}
      <TaskDetailModal
        task={items.find((t) => t.id === selectedTaskId) || null}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
};

export default AllTasksPage;
