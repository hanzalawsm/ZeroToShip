"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import Sidebar from "./Sidebar";
import "./AppShell.css";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth();
  
  // collapsed state:
  // On desktop: true = collapsed small sidebar, false = expanded sidebar
  // On mobile: true = sidebar hidden offscreen, false = sidebar visible (drawer)
  // We'll default to expanded on desktop, hidden on mobile
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true); // default hidden on mobile
      } else {
        setCollapsed(false); // default expanded on desktop
      }
    };

    handleResize(); // Init on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <div className="app-shell">
      {/* Mobile Hamburger Floating Button */}
      <button 
        className="mobile-menu-btn" 
        onClick={handleToggleCollapse}
        aria-label="Open Menu"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="15" x2="17" y2="15" />
        </svg>
      </button>

      <Sidebar
        userName={user?.name || "User"}
        avatarUrl={user?.avatar_url || null}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <main className={`app-main ${collapsed ? "sidebar-collapsed" : ""}`}>
        {children}
      </main>
    </div>
  );
}
