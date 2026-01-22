import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchTasks, updateTaskStatus } from "@/features/tasks/tasksSlice";
import {
  Spinner,
  StatusBadge,
  PriorityBadge,
  EmptyState,
  Table,
} from "@task-approval/shared-ui";
import type { Column } from "@task-approval/shared-ui";
import toast from "react-hot-toast";
import styles from "./PendingTasksPage.module.scss";
import type { Priority, Task } from "@/services/types";

const PendingTasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.tasks);
  const user = useAppSelector((state) => state.auth.user);
  const [filter, setFilter] = useState<{
    priority?: Priority;
    category?: string;
  }>({});
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filtered = items.filter(
    (t) =>
      t.status === "pending" &&
      (!filter.priority || t.priority === filter.priority) &&
      (!filter.category || t.category === filter.category) &&
      (t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.createdBy.toLowerCase().includes(search.toLowerCase())),
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const handleApprove = async (id: string) => {
    const result = await dispatch(updateTaskStatus({ id, status: "approved" }));

    if (updateTaskStatus.fulfilled.match(result)) {
      toast.success("Talep onaylandı!");
      dispatch(fetchTasks());
    } else {
      toast.error("Onaylama başarısız!");
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Red sebebi zorunludur!");
      return;
    }

    const result = await dispatch(
      updateTaskStatus({
        id,
        status: "rejected",
        rejectionReason,
      }),
    );

    if (updateTaskStatus.fulfilled.match(result)) {
      toast.success("Talep reddedildi!");
      setRejectId(null);
      setRejectionReason("");
      dispatch(fetchTasks());
    } else {
      toast.error("Red işlemi başarısız!");
    }
  };

  const columns: Column<Task>[] = [
    {
      key: "title",
      header: "Başlık",
      render: (task: Task) => (
        <span style={{ fontWeight: 500 }}>{task.title}</span>
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
      header: "İşlem",
      render: (task: Task) => (
        <div className={styles.actions}>
          {user?.role === "Viewer" ? (
            <div
              className={styles["disabled-action"]}
              data-tooltip="Yetkiniz yok"
            >
              <button disabled className={styles["approve-btn"]}>
                Onayla
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(task.id);
              }}
              className={styles["approve-btn"]}
            >
              Onayla
            </button>
          )}
          {user?.role === "Viewer" ? (
            <div
              className={styles["disabled-action"]}
              data-tooltip="Yetkiniz yok"
            >
              <button disabled className={styles["reject-btn"]}>
                Reddet
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRejectId(task.id);
              }}
              className={styles["reject-btn"]}
            >
              Reddet
            </button>
          )}
        </div>
      ),
      width: "180px",
      align: "center",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles["page-header"]}>
        <div>
          <h1 className={styles["page-title"]}>Bekleyen Talepler</h1>
          <p className={styles["page-subtitle"]}>
            Onay bekleyen talepleri inceleyin ve işleme alın
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          className={styles["search-input"]}
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter.priority || ""}
          onChange={(e) =>
            setFilter((f) => ({
              ...f,
              priority: (e.target.value as Priority) || undefined,
            }))
          }
        >
          <option value="">Öncelik (Tümü)</option>
          <option value="low">Düşük</option>
          <option value="normal">Normal</option>
          <option value="high">Yüksek</option>
          <option value="urgent">Acil</option>
        </select>
        <select
          value={filter.category || ""}
          onChange={(e) =>
            setFilter((f) => ({ ...f, category: e.target.value || undefined }))
          }
        >
          <option value="">Kategori (Tümü)</option>
          <option value="Teknik Destek">Teknik Destek</option>
          <option value="İzin Talebi">İzin Talebi</option>
          <option value="Satın Alma">Satın Alma</option>
          <option value="Diğer">Diğer</option>
        </select>
      </div>
      {loading && <Spinner />}
      {error && <div className="error">{error}</div>}

      {!loading && filtered.length > 0 && (
        <Table
          columns={columns}
          data={paginatedTasks}
          keyExtractor={(task: Task) => task.id}
          emptyMessage="Bekleyen talep bulunamadı"
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
            itemsPerPage,
            totalItems: filtered.length,
            showInfo: true,
          }}
        />
      )}

      {!loading && filtered.length === 0 && (
        <EmptyState
          title="Bekleyen talep bulunamadı"
          description="Seçtiğiniz kriterlere uygun bekleyen talep bulunmuyor."
        />
      )}

      {/* Red Modal */}
      {rejectId && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <h3>Talebi Reddet</h3>
            <div className={styles["form-content"]}>
              <textarea
                placeholder="Red sebebini yazın..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
              <div className={styles["modal-actions"]}>
                <button
                  onClick={() => setRejectId(null)}
                  className={styles["cancel-btn"]}
                >
                  İptal
                </button>
                <button
                  onClick={() => handleReject(rejectId)}
                  disabled={!rejectionReason.trim()}
                  className={styles["submit-btn"]}
                >
                  Reddet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingTasksPage;
