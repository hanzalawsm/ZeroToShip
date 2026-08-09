"use client";

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AppShell from './AppShell';
import AuthModal from './AuthModal';
import LandingPage from '@/app/landing/page';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Show a minimal loading state while checking auth
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.95rem',
        gap: '12px',
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
          <circle cx="10" cy="10" r="8" opacity="0.25" />
          <path d="M18 10a8 8 0 01-8 8" strokeLinecap="round" />
        </svg>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onOpenAuth={() => setAuthModalOpen(true)} />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={login}
          onRegister={register}
        />
      </>
    );
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
