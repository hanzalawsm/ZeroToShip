"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Sidebar.css";

interface SidebarProps {
  userName: string;
  avatarUrl: string | null;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  userName,
  avatarUrl,
  onLogout,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo-text">SLO</span>
            {!collapsed && (
              <span className="logo-full">Smart Local Orchestrator</span>
            )}
          </div>
          <button className="collapse-toggle" onClick={onToggleCollapse} aria-label="Toggle Sidebar">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`toggle-icon ${collapsed ? "rotate" : ""}`}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`} title="Chat">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 5.5-4.5 10-10 10S0 15.5 0 10 4.5 0 10 0s10 4.5 10 10z" />
              <path d="M5.5 10a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0-9 0" />
            </svg>
            {!collapsed && <span className="nav-text">Chat</span>}
          </Link>
          <Link href="/bookings" className={`nav-link ${pathname === "/bookings" ? "active" : ""}`} title="Bookings">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="14" height="14" rx="2" ry="2" />
              <line x1="10" y1="2" x2="10" y2="6" />
              <line x1="3" y1="8" x2="17" y2="8" />
            </svg>
            {!collapsed && <span className="nav-text">Bookings</span>}
          </Link>
          <Link href="/profile" className={`nav-link ${pathname === "/profile" ? "active" : ""}`} title="Profile">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 10a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
              <path d="M0 20a10 10 0 0 1 20 0" />
            </svg>
            {!collapsed && <span className="nav-text">Profile</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile" title={userName}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            {!collapsed && <span className="user-name">{userName}</span>}
          </div>
          <button className="logout-btn" onClick={onLogout} aria-label="Logout" title="Logout">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 2H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
              <polyline points="14 15 19 10 14 5" />
              <line x1="19" y1="10" x2="7" y2="10" />
            </svg>
            {!collapsed && <span className="logout-text">Logout</span>}
          </button>
        </div>
      </aside>
      
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`mobile-backdrop ${collapsed ? "" : "visible"}`}
        onClick={onToggleCollapse}
      />
    </>
  );
}
