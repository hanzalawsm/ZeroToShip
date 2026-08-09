"use client";

import React from 'react';
import { ProviderResponse } from '../lib/types';
import './ProviderCard.css';

interface ProviderCardProps {
  provider: ProviderResponse;
  onBook: (provider: ProviderResponse) => void;
}

export function ProviderCard({ provider, onBook }: ProviderCardProps) {
  return (
    <article className="provider-card glass">
      <div className="provider-header">
        <div className="provider-avatar">
          {provider.avatar_url ? (
            <img src={provider.avatar_url} alt={provider.name} loading="lazy" />
          ) : (
            <div className="avatar-placeholder flex-center">
              {provider.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="provider-info">
          <h3 className="provider-name">{provider.name}</h3>
          <p className="provider-category-text">
            {provider.category} • {provider.neighborhood_zone}
          </p>
        </div>
        <div className="provider-rating">
          <span className="star">★</span> {provider.rating.toFixed(1)}
          <span className="reviews">({provider.review_count})</span>
        </div>
      </div>

      <div className="provider-stats">
        {provider.response_time && (
          <div className="stat-item">
            <span className="stat-label">Response</span>
            <span className="stat-value">{provider.response_time}</span>
          </div>
        )}
        <div className="stat-item">
          <span className="stat-label">Completion</span>
          <span className="stat-value">{Math.round(provider.completion_rate * 100)}%</span>
        </div>
        {provider.hourly_rate && (
          <div className="stat-item">
            <span className="stat-label">Rate</span>
            <span className="stat-value">{provider.hourly_rate}</span>
          </div>
        )}
      </div>

      <div className="provider-footer">
        <div className="provider-badges">
          {provider.verified && <span className="badge verified">Verified</span>}
          {provider.available_now && <span className="badge available">Available Now</span>}
        </div>
        <button className="book-btn" onClick={() => onBook(provider)}>
          Book Now
        </button>
      </div>
    </article>
  );
}
