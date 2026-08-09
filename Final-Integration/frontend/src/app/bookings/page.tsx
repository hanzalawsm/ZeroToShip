"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { BookingResponse } from '@/lib/types';
import './page.css';

export default function BookingsPage() {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBookings();
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      const data = await api.getBookings();
      setBookings(data.reverse()); // Newest first
      setLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load bookings';
      setError(message);
      setLoading(false);
    }
  };

  const handleCompleteBooking = async (bookingId: number) => {
    try {
      setCompletingId(bookingId);
      const updated = await api.completeBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.booking_id === bookingId ? updated : b))
      );
      setActionSuccess(`Booking #${bookingId} marked as Completed!`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to complete booking';
      alert(message);
    } finally {
      setCompletingId(null);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      setCancellingId(bookingId);
      await api.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.booking_id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );
      setActionSuccess(`Booking #${bookingId} was successfully cancelled.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to cancel booking';
      alert(message);
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const pendingCount = bookings.filter((b) => b.status.toLowerCase() === 'pending').length;
  const completedCount = bookings.filter((b) => b.status.toLowerCase() === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status.toLowerCase() === 'cancelled').length;

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('plumb')) return '🔧';
    if (cat.includes('elec')) return '⚡';
    if (cat.includes('carp')) return '🪚';
    if (cat.includes('paint')) return '🎨';
    if (cat.includes('clean')) return '✨';
    return '🛠️';
  };

  if (loading) {
    return (
      <main className="bookings-container">
        <div className="page-header">
          <div className="header-eyebrow">Service Marketplace</div>
          <h1>My Bookings</h1>
          <p className="page-subtitle">Manage your local service requests & bookings in Karachi</p>
        </div>
        <div className="page-loading">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bookings-container">
        <div className="page-error glass">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Bookings</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchBookings}>Retry</button>
        </div>
      </main>
    );
  }

  return (
    <main className="bookings-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <span className="header-eyebrow">Service History</span>
          <h1>My Bookings</h1>
          <p className="page-subtitle">Track, manage, and review your home service bookings</p>
        </div>
        <Link href="/" className="new-booking-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Find a Provider
        </Link>
      </div>

      {/* Action Notification */}
      {actionSuccess && (
        <div className="toast-notification success">
          <span>✨</span> {actionSuccess}
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="stats-bar glass">
        <div className="stat-item" onClick={() => setFilterStatus('ALL')}>
          <span className="stat-label">Total Requests</span>
          <span className="stat-value">{bookings.length}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item" onClick={() => setFilterStatus('Pending')}>
          <span className="stat-label">Active / Pending</span>
          <span className="stat-value pending">{pendingCount}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item" onClick={() => setFilterStatus('Completed')}>
          <span className="stat-label">Completed</span>
          <span className="stat-value completed">{completedCount}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item" onClick={() => setFilterStatus('Cancelled')}>
          <span className="stat-label">Cancelled</span>
          <span className="stat-value cancelled">{cancelledCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`tab-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterStatus('ALL')}
        >
          All ({bookings.length})
        </button>
        <button
          className={`tab-btn ${filterStatus === 'Pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Pending')}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`tab-btn ${filterStatus === 'Completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Completed')}
        >
          Completed ({completedCount})
        </button>
        <button
          className={`tab-btn ${filterStatus === 'Cancelled' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Cancelled')}
        >
          Cancelled ({cancelledCount})
        </button>
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="empty-bookings glass">
          <div className="empty-icon">📋</div>
          <h2>No {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} bookings found</h2>
          <p>You haven't placed any {filterStatus !== 'ALL' ? filterStatus.toLowerCase() : ''} service requests yet.</p>
          <Link href="/" className="chip-cta-btn">
            Chat with AI Assistant
          </Link>
        </div>
      ) : (
        /* Bookings Grid */
        <div className="bookings-grid">
          {filteredBookings.map((booking) => {
            const isPending = booking.status.toLowerCase() === 'pending';
            const catIcon = getCategoryIcon(booking.provider.category);

            return (
              <div key={booking.booking_id} className="booking-card glass">
                <div className="card-top-row">
                  <div className="booking-badge-group">
                    <span className="booking-id">#{booking.booking_id}</span>
                    <span className="category-pill">
                      {catIcon} {booking.provider.category}
                    </span>
                  </div>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="provider-section">
                  {booking.provider.avatar_url ? (
                    <img
                      src={booking.provider.avatar_url}
                      alt={booking.provider.name}
                      className="provider-avatar"
                    />
                  ) : (
                    <div className="provider-avatar placeholder flex-center">
                      {booking.provider.name.charAt(0)}
                    </div>
                  )}

                  <div className="provider-info">
                    <div className="provider-title-row">
                      <h3 className="provider-name">{booking.provider.name}</h3>
                      {booking.provider.verified && (
                        <span className="verified-badge" title="Verified Professional">✓</span>
                      )}
                    </div>
                    <div className="provider-meta">
                      <span className="rating">⭐ {booking.provider.rating.toFixed(1)}</span>
                      <span className="bullet">•</span>
                      <span className="zone">{booking.provider.neighborhood_zone}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-details-box">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <div className="detail-content">
                      <span className="detail-label">Schedule Time</span>
                      <span className="detail-val">{booking.booking_time}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <div className="detail-content">
                      <span className="detail-label">Service Location</span>
                      <span className="detail-val">{booking.provider.neighborhood_zone}, Karachi</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="card-actions-row">
                  {booking.provider.phone && (
                    <a href={`tel:${booking.provider.phone}`} className="contact-btn">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {booking.provider.phone}
                    </a>
                  )}

                  {isPending && (
                    <div className="action-buttons-group">
                      <button
                        className="complete-action-btn"
                        onClick={() => handleCompleteBooking(booking.booking_id)}
                        disabled={completingId === booking.booking_id}
                      >
                        {completingId === booking.booking_id ? 'Completing...' : '✓ Complete Booking'}
                      </button>
                      <button
                        className="cancel-action-btn"
                        onClick={() => handleCancelBooking(booking.booking_id)}
                        disabled={cancellingId === booking.booking_id}
                      >
                        {cancellingId === booking.booking_id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
