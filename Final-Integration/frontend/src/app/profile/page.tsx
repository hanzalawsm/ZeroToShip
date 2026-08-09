"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { UserProfileResponse } from '@/lib/types';
import './page.css';

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=John",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zane",
  "https://api.dicebear.com/7.x/identicon/svg?seed=Karachi"
];

export default function ProfilePage() {
  const { isAuthenticated, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      setEditName(data.name);
      setEditPhone(data.phone || '');
      setEditAvatar(data.avatar_url || '');
      setLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load profile';
      setError(message);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      const updated = await api.updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        avatar_url: editAvatar.trim() || undefined,
      });
      setProfile(updated);
      setIsEditing(false);
      setToastMessage('Profile updated successfully!');
      setTimeout(() => setToastMessage(null), 4000);
      refreshProfile();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <main className="profile-container">
        <div className="page-header">
          <span className="header-eyebrow">Account Settings</span>
          <h1>My Profile</h1>
        </div>
        <div className="page-loading">
          <div className="skeleton-card" style={{ height: '320px' }}></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-container">
        <div className="page-error glass">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Profile</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="profile-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <span className="header-eyebrow">Account & Security</span>
          <h1>User Profile</h1>
          <p className="page-subtitle">Manage your personal information and preferences</p>
        </div>
      </div>

      {toastMessage && (
        <div className="toast-notification success">
          <span>✨</span> {toastMessage}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="profile-dashboard-grid">
        {/* Left Side: Avatar Card */}
        <div className="profile-summary-card glass">
          <div className="avatar-ring-container">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h2 className="user-name-display">{profile.name}</h2>
          <p className="user-email-display">{profile.email}</p>

          <div className="profile-badges">
            <span className="badge-pill verified">
              <span className="badge-dot"></span> Verified Resident
            </span>
            <span className="badge-pill zone">Karachi Member</span>
          </div>

          <div className="profile-quick-stats">
            <div className="qstat-item">
              <span className="qstat-label">User ID</span>
              <span className="qstat-val">#{profile.user_id}</span>
            </div>
            <div className="qstat-divider"></div>
            <div className="qstat-item">
              <span className="qstat-label">Status</span>
              <span className="qstat-val active">Active</span>
            </div>
          </div>
        </div>

        {/* Right Side: Details Form Card */}
        <div className="profile-details-card glass">
          <div className="card-header-bar">
            <h3>Personal Information</h3>
            {!isEditing ? (
              <button className="edit-mode-btn" onClick={() => setIsEditing(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions-inline">
                <button className="save-btn-small" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="cancel-btn-small"
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(profile.name);
                    setEditPhone(profile.phone || '');
                    setEditAvatar(profile.avatar_url || '');
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-form-body">
            {/* Full Name */}
            <div className="form-field-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="styled-input"
                  placeholder="Your full name"
                />
              ) : (
                <div className="field-display-value">{profile.name}</div>
              )}
            </div>

            {/* Email Address */}
            <div className="form-field-group">
              <label>Email Address <span className="read-only-tag">(Read-only)</span></label>
              <div className="field-display-value email-value">
                {profile.email}
                <span className="verified-check">✓ Verified</span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-field-group">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="styled-input"
                  placeholder="e.g. 0300-1234567"
                />
              ) : (
                <div className="field-display-value">
                  {profile.phone ? profile.phone : <span className="placeholder-text">Not provided</span>}
                </div>
              )}
            </div>

            {/* Avatar URL / Selection when editing */}
            {isEditing && (
              <div className="form-field-group">
                <label>Profile Avatar</label>
                <div className="avatar-preset-picker">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`preset-btn ${editAvatar === url ? 'selected' : ''}`}
                      onClick={() => setEditAvatar(url)}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="styled-input avatar-url-input"
                  placeholder="Or paste custom image URL..."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
