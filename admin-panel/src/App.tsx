import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardPage from "@/features/dashboard/DashboardPage";
import PendingTasksPage from "@/features/tasks/PendingTasksPage";
import AllTasksPage from "@/features/tasks/AllTasksPage";
import AdminUsersPage from "@/features/adminUsers/AdminUsersPage";
import LoginPage from "./features/auth/LoginPage";
import Layout from "@/components/Layout";
import Toast from "@/components/Toast";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loadUserFromStorage } from "@/features/auth/authSlice";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Role-based Route Protection
const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Array<"Admin" | "Moderator" | "Viewer">;
}) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Layout>
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🚫</div>
          <h2
            style={{
              fontSize: "24px",
              marginBottom: "8px",
              color: "var(--text-primary)",
            }}
          >
            Erişim Reddedildi
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "24px",
            }}
          >
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
            }}
          >
            Mevcut rolünüz: <strong>{user.role}</strong>
          </p>
        </div>
      </Layout>
    );
  }

  return <Layout>{children}</Layout>;
};

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <>
      <Toast />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/pending"
            element={
              <ProtectedRoute>
                <PendingTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/all"
            element={
              <RoleProtectedRoute allowedRoles={["Admin", "Moderator"]}>
                <AllTasksPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin-users"
            element={
              <RoleProtectedRoute allowedRoles={["Admin"]}>
                <AdminUsersPage />
              </RoleProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
