import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import ThemeSwitcher from "./ThemeSwitcher";
import styles from "./Layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "",
    roles: ["Admin", "Moderator", "Viewer"],
  },
  {
    path: "/tasks/pending",
    label: "Bekleyen Talepler",
    icon: "",
    roles: ["Admin", "Moderator", "Viewer"],
  },
  {
    path: "/tasks/all",
    label: "Tüm Talepler",
    icon: "",
    roles: ["Admin", "Moderator"],
  },
  {
    path: "/admin-users",
    label: "Kullanıcı Yönetimi",
    icon: "",
    roles: ["Admin"],
  },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const visibleNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  );

  return (
    <div className={styles.layout}>
      {/* Mobile Header */}
      <div className={styles["mobile-header"]}>
        <h1>Admin Panel</h1>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <ThemeSwitcher />
          <button
            className={styles["hamburger-btn"]}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menüyü Aç"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ""}`}
      >
        <div className={styles.header}>
          <div className={styles["header-content"]}>
            <div>
              <h1>Admin Panel</h1>
              {user && <div className={styles["user-email"]}>{user.email}</div>}
            </div>
            <div className={styles["theme-wrapper"]}>
              <ThemeSwitcher />
            </div>
          </div>
          <button
            className={styles["close-btn"]}
            onClick={closeMobileMenu}
            aria-label="Menüyü Kapat"
          >
            ✕
          </button>
        </div>

        <nav className={styles.nav}>
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles["nav-item"]} ${isActive ? styles.active : ""}`}
                onClick={closeMobileMenu}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          {user && (
            <div className={styles["user-info"]}>
              <div className={styles["user-name"]}>{user.name}</div>
              <div className={styles["user-role"]}>Rol: {user.role}</div>
            </div>
          )}
          <button onClick={handleLogout} className={styles["logout-btn"]}>
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles["main-content"]}>{children}</div>
    </div>
  );
};

export default Layout;
