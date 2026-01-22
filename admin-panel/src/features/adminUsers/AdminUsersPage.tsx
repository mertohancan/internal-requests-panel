import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchAdminUsers,
  createAdminUser,
  deleteAdminUser,
  updateAdminUser,
} from "@/features/adminUsers/adminUsersSlice";
import { Spinner, EmptyState, Modal, Table } from "@task-approval/shared-ui";
import type { Column } from "@task-approval/shared-ui";
import toast from "react-hot-toast";
import styles from "./AdminUsersPage.module.scss";
import type {
  AdminUser,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
} from "@/services/types";

// Zod validation schemas
const createUserSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  role: z.enum(["Admin", "Moderator", "Viewer"]),
});

const updateUserSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().optional(),
  role: z.enum(["Admin", "Moderator", "Viewer"]),
});

const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.adminUsers);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // React Hook Form for Create User
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<CreateAdminUserRequest>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Viewer",
    },
  });

  // React Hook Form for Update User
  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
  } = useForm<UpdateAdminUserRequest>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Viewer",
    },
  });

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleAddUser = async (data: CreateAdminUserRequest) => {
    const result = await dispatch(createAdminUser(data));

    if (createAdminUser.fulfilled.match(result)) {
      toast.success("Kullanıcı eklendi!");
      setShowAddModal(false);
      resetCreate();
      dispatch(fetchAdminUsers());
    } else {
      toast.error("Kullanıcı eklenemedi!");
    }
  };

  const handleDeleteUser = async (id: string) => {
    const result = await dispatch(deleteAdminUser(id));

    if (deleteAdminUser.fulfilled.match(result)) {
      toast.success("Kullanıcı silindi!");
      setDeleteId(null);
      dispatch(fetchAdminUsers());
    } else {
      toast.error("Kullanıcı silinemedi!");
    }
  };

  const handleEditClick = (user: AdminUser) => {
    setEditingUser(user);
    resetUpdate({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (data: UpdateAdminUserRequest) => {
    if (!editingUser) return;

    const result = await dispatch(
      updateAdminUser({
        userId: editingUser.id,
        data,
      }),
    );

    if (updateAdminUser.fulfilled.match(result)) {
      toast.success("Kullanıcı güncellendi!");
      setShowEditModal(false);
      setEditingUser(null);
      resetUpdate();
    } else {
      toast.error("Kullanıcı güncellenemedi!");
    }
  };

  // Pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = items.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Ad",
      render: (user: AdminUser) => (
        <span style={{ fontWeight: 500 }}>{user.name}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user: AdminUser) => user.email,
    },
    {
      key: "role",
      header: "Rol",
      render: (user: AdminUser) => user.role,
      width: "120px",
    },
    {
      key: "actions",
      header: "İşlem",
      render: (user: AdminUser) => {
        const isAdmin = currentUser?.role === "Admin";
        const canDelete = isAdmin && user.id !== currentUser?.id;

        return (
          <div className={styles.actions}>
            {isAdmin ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(user);
                }}
                className={styles["edit-btn"]}
              >
                Düzenle
              </button>
            ) : (
              <div
                className={styles["disabled-action"]}
                data-tooltip="Sadece Admin yetkisi ile düzenlenebilir"
              >
                <button disabled className={styles["edit-btn"]}>
                  Düzenle
                </button>
              </div>
            )}
            {canDelete ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(user.id);
                }}
                className={styles["delete-btn"]}
              >
                Sil
              </button>
            ) : (
              <div
                className={styles["disabled-action"]}
                data-tooltip={
                  !isAdmin
                    ? "Sadece Admin yetkisi ile silinebilir"
                    : "Kendi hesabınız"
                }
              >
                <button disabled className={styles["delete-btn"]}>
                  Sil
                </button>
              </div>
            )}
          </div>
        );
      },
      width: "180px",
      align: "center",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <h1 className={styles["page-title"]}>Kullanıcı Yönetimi</h1>
          <p className={styles["page-subtitle"]}>
            Admin kullanıcılarını ekleyin, düzenleyin ve yönetin
          </p>
        </div>
        {currentUser?.role === "Admin" ? (
          <button
            onClick={() => setShowAddModal(true)}
            className={styles["add-btn"]}
          >
            + Yeni Kullanıcı
          </button>
        ) : (
          <div
            className={styles["disabled-action"]}
            data-tooltip="Sadece Admin yetkisi ile kullanıcı eklenebilir"
          >
            <button disabled className={styles["add-btn"]}>
              + Yeni Kullanıcı
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className={styles["loading-wrapper"]}>
          <Spinner />
        </div>
      )}
      {error && <div className={styles["error-message"]}>{error}</div>}

      {!loading && items.length > 0 && (
        <Table
          columns={columns}
          data={paginatedUsers}
          keyExtractor={(user: AdminUser) => user.id}
          emptyMessage="Kullanıcı bulunamadı"
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
            itemsPerPage,
            totalItems: items.length,
            showInfo: true,
          }}
        />
      )}

      {!loading && items.length === 0 && (
        <EmptyState
          title="Kullanıcı bulunamadı"
          description="Henüz sistemde kayıtlı admin kullanıcı bulunmuyor."
        />
      )}

      {/* Yeni Kullanıcı Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetCreate();
        }}
        title="Yeni Kullanıcı Ekle"
      >
        <form
          onSubmit={handleSubmitCreate(handleAddUser)}
          className={styles["modal-form"]}
        >
          <div className={styles["form-field"]}>
            <input
              placeholder="Ad Soyad"
              {...registerCreate("name")}
              className={errorsCreate.name ? styles["input-error"] : ""}
            />
            {errorsCreate.name && (
              <span className={styles["error-message"]}>
                {errorsCreate.name.message}
              </span>
            )}
          </div>
          <div className={styles["form-field"]}>
            <input
              type="email"
              placeholder="Email"
              {...registerCreate("email")}
              className={errorsCreate.email ? styles["input-error"] : ""}
            />
            {errorsCreate.email && (
              <span className={styles["error-message"]}>
                {errorsCreate.email.message}
              </span>
            )}
          </div>
          <div className={styles["form-field"]}>
            <input
              type="password"
              placeholder="Şifre"
              {...registerCreate("password")}
              className={errorsCreate.password ? styles["input-error"] : ""}
            />
            {errorsCreate.password && (
              <span className={styles["error-message"]}>
                {errorsCreate.password.message}
              </span>
            )}
          </div>
          <select {...registerCreate("role")}>
            <option value="Viewer">Viewer</option>
            <option value="Moderator">Moderator</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" className={styles["submit-btn"]}>
            Kullanıcı Ekle
          </button>
        </form>
      </Modal>

      {/* Düzenleme Modal */}
      <Modal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
          resetUpdate();
        }}
        title="Kullanıcı Düzenle"
      >
        <form
          onSubmit={handleSubmitUpdate(handleUpdateUser)}
          className={styles["modal-form"]}
        >
          <div className={styles["form-field"]}>
            <input
              placeholder="Ad Soyad"
              {...registerUpdate("name")}
              className={errorsUpdate.name ? styles["input-error"] : ""}
            />
            {errorsUpdate.name && (
              <span className={styles["error-message"]}>
                {errorsUpdate.name.message}
              </span>
            )}
          </div>
          <div className={styles["form-field"]}>
            <input
              type="email"
              placeholder="Email"
              {...registerUpdate("email")}
              className={errorsUpdate.email ? styles["input-error"] : ""}
            />
            {errorsUpdate.email && (
              <span className={styles["error-message"]}>
                {errorsUpdate.email.message}
              </span>
            )}
          </div>
          <div className={styles["form-field"]}>
            <input
              type="password"
              placeholder="Şifre (değiştirmek için doldurun)"
              {...registerUpdate("password")}
              className={errorsUpdate.password ? styles["input-error"] : ""}
            />
            {errorsUpdate.password && (
              <span className={styles["error-message"]}>
                {errorsUpdate.password.message}
              </span>
            )}
          </div>
          <select {...registerUpdate("role")}>
            <option value="Viewer">Viewer</option>
            <option value="Moderator">Moderator</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" className={styles["submit-btn"]}>
            Kullanıcıyı Güncelle
          </button>
        </form>
      </Modal>

      {/* Silme Onay Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Kullanıcıyı Sil"
      >
        <div className={styles["delete-modal"]}>
          <p className={styles.message}>
            Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri
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
              onClick={() => deleteId && handleDeleteUser(deleteId)}
              className={styles["delete-confirm-btn"]}
            >
              Sil
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
