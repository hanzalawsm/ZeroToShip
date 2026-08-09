"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { UserProfileResponse } from '@/lib/types';
import './page.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      window.location.href = '/';
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      setEditName(data.name);
      setEditPhone(data.phone || '');
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      const updated = await api.updateProfile({
        name: editName,
        phone: editPhone
      });
      setProfile(updated);
      setIsEditing(false);
      setLoading(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="loading-state">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!profile) return null;

  return (
    <main className="profile-container">
      <h1 className="accent-gradient">My Profile</h1>
      
      <div className="profile-card glass">
        <div className="profile-header">
          <div className="avatar-section">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="profile-avatar large" />
            ) : (
              <div className="profile-avatar large placeholder">
                {profile.name.charAt(0)}
              </div>
            )}
            <div className="avatar-overlay-text">Assigned Avatar</div>
          </div>
          <div className="header-info">
            <h2>{profile.name}</h2>
            <p className="email-text">{profile.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="form-group">
            <label>Full Name</label>
            {isEditing ? (
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="profile-input"
              />
            ) : (
              <div className="detail-value">{profile.name}</div>
            )}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            {isEditing ? (
              <input 
                type="text" 
                value={editPhone} 
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Not set"
                className="profile-input"
              />
            ) : (
              <div className="detail-value">{profile.phone || <span className="empty-text">Not set</span>}</div>
            )}
          </div>
          
          <div className="form-group">
            <label>Account ID</label>
            <div className="detail-value id-text">#{profile.user_id}</div>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="cancel-btn" onClick={() => {
                setIsEditing(false);
                setEditName(profile.name);
                setEditPhone(profile.phone || '');
              }} disabled={loading}>
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
