import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { Layout as SharedLayout } from "@task-approval/shared-ui";
import type { NavItem } from "@task-approval/shared-ui";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "📊",
  },
  {
    path: "/tasks/new",
    label: "Yeni Talep",
    icon: "➕",
  },
  {
    path: "/tasks",
    label: "Taleplerim",
    icon: "📋",
  },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const brandIcon = (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#3b82f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "1.125rem",
      }}
    >
      T
    </div>
  );

  return (
    <SharedLayout
      navItems={navItems}
      currentPath={location.pathname}
      user={user}
      onNavigate={navigate}
      onLogout={handleLogout}
      brandName="Talep Sistemi"
      brandIcon={brandIcon}
    >
      {children}
    </SharedLayout>
  );
};

export default Layout;
