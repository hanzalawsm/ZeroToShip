"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ProviderResponse, BookingCreate } from '../lib/types';
import { api } from '../lib/api';
import './BookingModal.css';

interface BookingModalProps {
  provider: ProviderResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (bookingId: number) => void;
}

export function BookingModal({ provider, isOpen, onClose, onBookingSuccess }: BookingModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bookingTime, setBookingTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
      setBookingTime('');
      setError(null);
    }
  }, [isOpen]);

  // Light dismiss
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleLightDismiss = (e: MouseEvent) => {
      if (e.target === dialog) {
        onClose();
      }
    };
    
    dialog.addEventListener('click', handleLightDismiss);
    return () => dialog.removeEventListener('click', handleLightDismiss);
  }, [onClose]);

  if (!provider) return null;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTime.trim()) {
      setError('Please enter a booking time');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // In a real app we need user to be logged in. 
      // If we aren't, the API will fail and we show error.
      // We'll pass a default time or what user typed.
      const bookingData: BookingCreate = {
        provider_id: provider.provider_id,
        booking_time: bookingTime
      };
      
      const res = await api.createBooking(bookingData);
      onBookingSuccess(res.booking_id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to book. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="booking-modal">
      <form onSubmit={handleBook}>
        <div className="modal-header">
          <h2>Book {provider.name}</h2>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-desc">
            You are about to request a booking for <strong>{provider.category}</strong> services. 
            {provider.hourly_rate && ` The estimated rate is ${provider.hourly_rate}.`}
          </p>

          <div className="form-group">
            <label htmlFor="bookingTime">When do you need them?</label>
            <input 
              type="text" 
              id="bookingTime"
              placeholder="e.g. Tomorrow morning, Oct 12th 2PM" 
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-confirm" disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
