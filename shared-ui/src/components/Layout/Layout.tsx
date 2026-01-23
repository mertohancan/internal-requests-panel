import React, { useState } from "react";

export interface NavItem {
  path: string;
  label: string;
  icon?: string;
  roles?: string[];
}

export interface LayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  currentPath: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  } | null;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  brandName: string;
  brandIcon?: React.ReactNode;
  showThemeSwitcher?: boolean;
  themeSwitcher?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  navItems,
  currentPath,
  user,
  onNavigate,
  onLogout,
  brandName,
  brandIcon,
  showThemeSwitcher = false,
  themeSwitcher,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    onNavigate(path);
    closeMobileMenu();
  };

  const mobileHeaderStyle: React.CSSProperties = {
    display: "none",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    backgroundColor: "var(--sidebar-background, #1e293b)",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  const sidebarStyle: React.CSSProperties = {
    width: "260px",
    backgroundColor: "var(--sidebar-background, #1e293b)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  };

  const overlayStyle: React.CSSProperties = {
    display: isMobileMenuOpen ? "block" : "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  const headerStyle: React.CSSProperties = {
    padding: "1.5rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const navStyle: React.CSSProperties = {
    flex: 1,
    padding: "1rem 0",
    overflowY: "auto",
  };

  const navItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.875rem 1.5rem",
    color: "var(--sidebar-text-muted, rgba(255, 255, 255, 0.7))",
    textDecoration: "none",
    transition: "all var(--transition-base, 0.2s)",
    cursor: "pointer",
    border: "none",
    background: "none",
    width: "100%",
    fontSize: "0.95rem",
    textAlign: "left",
  };

  const activeNavItemStyle: React.CSSProperties = {
    ...navItemStyle,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "var(--sidebar-item-active, #3b82f6)",
    borderLeft: "3px solid var(--sidebar-item-active, #3b82f6)",
  };

  const footerStyle: React.CSSProperties = {
    padding: "1rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const userInfoStyle: React.CSSProperties = {
    marginBottom: "0.75rem",
    padding: "0.75rem",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "var(--radius-md, 0.5rem)",
  };

  const logoutButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "var(--color-error-500, #ef4444)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-md, 0.5rem)",
    cursor: "pointer",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "all var(--transition-base, 0.2s)",
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    width: "100%",
    backgroundColor: "var(--bg-secondary, #f8fafc)",
    overflow: "auto",
    boxSizing: "border-box",
  };

  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsiveContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    minHeight: "100vh",
    position: "relative",
  };

  return (
    <div style={responsiveContainerStyle}>
      {/* Mobile Header */}
      <div
        style={{
          ...mobileHeaderStyle,
          display: isMobile ? "flex" : "none",
        }}
      >
        <h1 style={{ fontSize: "1.25rem", margin: 0 }}>{brandName}</h1>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {showThemeSwitcher && themeSwitcher}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "0.25rem",
            }}
            aria-label="Menüyü Aç"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div style={overlayStyle} onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <div
        style={{
          ...sidebarStyle,
          transform:
            isMobile && !isMobileMenuOpen
              ? "translateX(-100%)"
              : "translateX(0)",
          position: isMobile ? "fixed" : "relative",
          zIndex: 1000,
          transition: "transform 0.3s ease",
          height: isMobile ? "100vh" : "auto",
        }}
      >
        <div style={headerStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {brandIcon}
                {brandName}
              </h1>
              {user && (
                <div
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.8125rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {user.email}
                </div>
              )}
            </div>
            {showThemeSwitcher && !isMobile && <div>{themeSwitcher}</div>}
          </div>
          {isMobile && (
            <button
              onClick={closeMobileMenu}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "0.25rem",
              }}
              aria-label="Menüyü Kapat"
            >
              ✕
            </button>
          )}
        </div>

        <nav style={navStyle}>
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  ...(isActive ? activeNavItemStyle : navItemStyle),
                  backgroundColor: isActive
                    ? "rgba(59, 130, 246, 0.1)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      "var(--sidebar-item-hover, rgba(255, 255, 255, 0.05))";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.icon && (
                  <span
                    style={{
                      opacity: 1,
                      fontSize: "1.1rem",
                      filter: "brightness(1.4) contrast(1.1)",
                    }}
                  >
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={footerStyle}>
          {user && (
            <div style={userInfoStyle}>
              <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                {user.name || user.email}
              </div>
              {user.role && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Rol: {user.role}
                </div>
              )}
            </div>
          )}
          <button
            onClick={onLogout}
            style={logoutButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--color-error-600, #dc2626)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--color-error-500, #ef4444)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>{children}</div>
    </div>
  );
};

export default Layout;
