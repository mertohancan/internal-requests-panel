import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-content"]}>
        <NavLink to="/dashboard" className={styles.brand}>
          <div className={styles["brand-icon"]}>T</div>
          <span>Talep Sistemi</span>
        </NavLink>

        <button
          className={styles["mobile-menu-btn"]}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menüyü aç/kapa"
        >
          ☰
        </button>

        <div
          className={`${styles["nav-links"]} ${mobileMenuOpen ? styles.open : ""}`}
        >
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks/new"
            end
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Yeni Talep
          </NavLink>

          <NavLink
            to="/tasks"
            end
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Taleplerim
          </NavLink>

          <button
            onClick={() => {
              dispatch(logout());
              setMobileMenuOpen(false);
            }}
            className={styles["logout-btn"]}
          >
            Çıkış
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
