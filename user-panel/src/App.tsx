import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyTasksPage from "@/features/tasks/MyTasksPage";
import DashboardPage from "@/features/tasks/DashboardPage";
import LoginPage from "@/features/auth/LoginPage";
import TaskFormPage from "@/features/tasks/TaskFormPage";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loadUserFromStorage } from "@/features/auth/authSlice";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
