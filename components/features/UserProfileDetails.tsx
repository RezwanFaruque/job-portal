"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { userStore } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";
import ProfileAvatar, { DEFAULT_AVATAR } from "@/components/features/ProfileAvatar";

const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function formatUserType(userType: string) {
  return userType.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UserProfileDetails() {
  const userDetails = userStore((state) => state.userDetails);
  const isLoadingDetails = userStore((state) => state.isLoadingDetails);
  const fetchUserDetails = userStore((state) => state.fetchUserDetails);
  const updateUserProfile = userStore((state) => state.updateUserProfile);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    userType: "job_seeker",
    profilePicture: DEFAULT_AVATAR,
  });

  useEffect(() => {
    fetchUserDetails().catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    });
  }, [fetchUserDetails]);

  useEffect(() => {
    if (userDetails) {
      setForm({
        userName: userDetails.userName,
        email: userDetails.email,
        userType: userDetails.userType,
        profilePicture: userDetails.profilePicture || DEFAULT_AVATAR,
      });
    }
  }, [userDetails]);

  function handleProfilePictureChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, WEBP, or GIF image.");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setError("Profile picture must be less than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        profilePicture: reader.result as string,
      }));
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const response = await updateUserProfile({
        userName: form.userName,
        email: form.email,
        userType: form.userType,
        profilePicture:
          form.profilePicture === DEFAULT_AVATAR ? undefined : form.profilePicture,
      });
      useToastStore.getState().showToast(response.message || "Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    if (userDetails) {
      setForm({
        userName: userDetails.userName,
        email: userDetails.email,
        userType: userDetails.userType,
        profilePicture: userDetails.profilePicture || DEFAULT_AVATAR,
      });
    }
    setError(null);
    setIsEditing(false);
  }

  if (isLoadingDetails && !userDetails) {
    return (
      <div id="personal-info">
        <div className="profile-page-title">Personal Information</div>
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div id="personal-info">
        <div className="profile-page-title">Personal Information</div>
        <div className="profile-error">{error || "Unable to load profile details."}</div>
      </div>
    );
  }

  const displayPicture = isEditing
    ? form.profilePicture
    : userDetails.profilePicture || DEFAULT_AVATAR;

  return (
    <div id="personal-info">
      <div className="profile-page-header">
        <div className="profile-page-title">Personal Information</div>
        {!isEditing && (
          <button type="button" className="profile-edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="profile-error">{error}</div>}

      <div className="personal-info-sections">
        <div className="title">About Me</div>
        <div className="section-body about-me">
          <div className="left">
            <div className="image-section">
              <ProfileAvatar
                src={displayPicture}
                alt={`${userDetails.userName} profile`}
                width={75}
                height={75}
                className="profile-picture"
              />
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    hidden
                    onChange={handleProfilePictureChange}
                  />
                  <button
                    type="button"
                    className="image-upload-button"
                    aria-label="Change profile picture"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    +
                  </button>
                </>
              )}
            </div>
            <div className="info-section">
              {isEditing ? (
                <>
                  <div className="name">
                    <input
                      type="text"
                      value={form.userName}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, userName: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="designation">
                    <select
                      value={form.userType}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, userType: event.target.value }))
                      }
                    >
                      <option value="job_seeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="name">{userDetails.userName}</div>
                  <div className="designation">{formatUserType(userDetails.userType)}</div>
                  <div className="loacation">Member since {formatDate(userDetails.createdAt)}</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="title">Account Information</div>
        <div className="section-body contact-information">
          {isEditing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-row">
                <label htmlFor="profile-email">Email Address</label>
                <input
                  id="profile-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="profile-form-row">
                <label htmlFor="profile-user-type">Account Type</label>
                <select
                  id="profile-user-type"
                  value={form.userType}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, userType: event.target.value }))
                  }
                >
                  <option value="job_seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>

              <div className="profile-form-actions">
                <button type="submit" className="profile-save-button" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details-list">
              <div className="profile-detail-item">
                <span className="profile-detail-label">Full Name</span>
                <span className="profile-detail-value">{userDetails.userName}</span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Email Address</span>
                <span className="profile-detail-value">{userDetails.email}</span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Account Type</span>
                <span className="profile-detail-value">{formatUserType(userDetails.userType)}</span>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Member Since</span>
                <span className="profile-detail-value">{formatDate(userDetails.createdAt)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
