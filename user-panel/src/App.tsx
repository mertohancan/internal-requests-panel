import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyTasksPage from "@/features/tasks/MyTasksPage";
import DashboardPage from "@/features/tasks/DashboardPage";
import LoginPage from "@/features/auth/LoginPage";
import TaskFormPage from "@/features/tasks/TaskFormPage";
import Layout from "@/components/Layout";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loadCurrentUser } from "@/features/auth/authSlice";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, initializing } = useAppSelector((state) => state.auth);

  // Wait for initial user load
  if (initializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "var(--bg-primary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid var(--border-light)",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--text-secondary)" }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function App() {
  const dispatch = useAppDispatch();
  const { user, initializing } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [dispatch]);

  // Show loading while checking authentication
  if (initializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#fafbfc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#6b7280" }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
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
          path="/tasks/new"
          element={
            <ProtectedRoute>
              <TaskFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <MyTasksPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
