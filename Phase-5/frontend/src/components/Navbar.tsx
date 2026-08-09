"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import AuthModal from './AuthModal';
import './Navbar.css';

export default function Navbar() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const pathname = usePathname();

  const fetchProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUserName(profile.name);
      setAvatarUrl(profile.avatar_url);
    } catch {
      localStorage.removeItem('token');
      setUserName(null);
      setAvatarUrl(null);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      fetchProfile();
    }
  }, []);

  const handleLogout = () => {
    api.logout();
    setUserName(null);
    setAvatarUrl(null);
    window.location.href = '/';
  };

  return (
    <>
      <nav className="navbar glass">
        <div className="nav-brand">
          <Link href="/">
            <h1 className="accent-gradient">SLO</h1>
          </Link>
        </div>
        
        <div className="nav-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Chat</Link>
          {userName && (
            <>
              <Link href="/bookings" className={pathname === '/bookings' ? 'active' : ''}>Bookings</Link>
              <Link href="/profile" className={pathname === '/profile' ? 'active' : ''}>Profile</Link>
            </>
          )}
        </div>

        <div className="nav-auth">
          {userName ? (
            <div className="user-menu">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="user-avatar" />
              ) : (
                <div className="user-avatar placeholder">{userName.charAt(0)}</div>
              )}
              <span className="user-name">{userName}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <button className="auth-submit-btn" onClick={() => setAuthModalOpen(true)}>
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => fetchProfile()}
      />
    </>
  );
}
