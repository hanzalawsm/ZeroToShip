"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BookingResponse } from '@/lib/types';
import './page.css';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      window.location.href = '/';
      return;
    }
    
    api.getBookings()
      .then((data) => {
        setBookings(data.reverse()); // Newest first
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load bookings');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-state">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <main className="bookings-container">
      <h1 className="accent-gradient">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="empty-bookings glass">
          <h2>No bookings yet</h2>
          <p>Go back to the chat to orchestrate your first service!</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="booking-card glass">
              <div className="booking-header">
                <span className="booking-id">#{booking.booking_id}</span>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="provider-info">
                {booking.provider.avatar_url ? (
                  <img src={booking.provider.avatar_url} alt={booking.provider.name} className="provider-avatar" />
                ) : (
                  <div className="provider-avatar placeholder">
                    {booking.provider.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="provider-name">{booking.provider.name}</h3>
                  <p className="provider-category">{booking.provider.category}</p>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">Date/Time</span>
                  <span className="value">{booking.booking_time}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location</span>
                  <span className="value">{booking.provider.neighborhood_zone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
