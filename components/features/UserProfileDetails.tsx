"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { userStore } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";
import ProfileAvatar, { DEFAULT_AVATAR } from "@/components/features/ProfileAvatar";
import { useCategoryStore } from "@/store/categoryStore";

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
  const updateCandidateProfile = userStore((state) => state.updateCandidateProfile);
  const categories = useCategoryStore((state) => state.categories);
  const getCategories = useCategoryStore((state) => state.getCategories);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    userType: "job_seeker",
    profilePicture: DEFAULT_AVATAR,
    jobCategory: [] as string[],
    skills: [] as string[],
    about: "",
  });

  useEffect(() => {
    fetchUserDetails().catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    });
  }, [fetchUserDetails]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    if (userDetails) {
      setForm({
        userName: userDetails.userName,
        email: userDetails.email,
        userType: userDetails.userType,
        profilePicture: userDetails.profilePicture || DEFAULT_AVATAR,
        jobCategory: userDetails.jobCategory || [],
        skills: userDetails.skills || [],
        about: userDetails.about || "",
      });
    }
  }, [userDetails]);

  function toggleJobCategory(categoryName: string) {
    setForm((current) => ({
      ...current,
      jobCategory: current.jobCategory.includes(categoryName)
        ? current.jobCategory.filter((category) => category !== categoryName)
        : [...current.jobCategory, categoryName],
    }));
  }

  function addSkills(value: string) {
    const newSkills = value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (!newSkills.length) return;

    setForm((current) => ({
      ...current,
      skills: Array.from(
        new Set([
          ...current.skills,
          ...newSkills.filter(
            (skill) =>
              !current.skills.some(
                (existingSkill) =>
                  existingSkill.toLowerCase() === skill.toLowerCase()
              )
          ),
        ])
      ),
    }));
    setSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));
  }

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
      setProfilePictureFile(file);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentUserDetails = userDetails;
    if (!currentUserDetails) return;
    setError(null);
    setIsSaving(true);

    try {
      const response = await updateCandidateProfile({
        userName: form.userName,
        email: form.email,
        jobCategory: form.jobCategory,
        skills: form.skills,
        about: form.about,
        profilePicture: profilePictureFile ?? undefined,
      });

      const accountTypeChanged = form.userType !== currentUserDetails.userType;
      if (accountTypeChanged) {
        await updateUserProfile({
          userName: form.userName,
          email: form.email,
          userType: form.userType,
        });
      }

      useToastStore
        .getState()
        .showToast(response.message || "Profile updated successfully!");
      setProfilePictureFile(null);
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
        jobCategory: userDetails.jobCategory || [],
        skills: userDetails.skills || [],
        about: userDetails.about || "",
      });
    }
    setSkillInput("");
    setProfilePictureFile(null);
    setIsCategoryMenuOpen(false);
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

              <div className="profile-form-row">
                <label id="profile-job-category-label">Job Categories</label>
                <div className="profile-multiselect">
                  <button
                    type="button"
                    className="profile-multiselect-trigger"
                    aria-labelledby="profile-job-category-label"
                    aria-haspopup="true"
                    aria-expanded={isCategoryMenuOpen}
                    aria-controls="profile-job-category-options"
                    onClick={() => setIsCategoryMenuOpen((open) => !open)}
                  >
                    <span>
                      {form.jobCategory.length
                        ? `${form.jobCategory.length} categor${
                            form.jobCategory.length === 1 ? "y" : "ies"
                          } selected`
                        : "Select job categories"}
                    </span>
                    <span aria-hidden="true">{isCategoryMenuOpen ? "▴" : "▾"}</span>
                  </button>
                  {isCategoryMenuOpen && (
                    <div
                      id="profile-job-category-options"
                      className="profile-multiselect-options"
                      role="group"
                      aria-labelledby="profile-job-category-label"
                    >
                      {categories.filter((category) => category.isActive).length ? (
                        categories
                          .filter((category) => category.isActive)
                          .map((category) => (
                            <label className="profile-multiselect-option" key={category._id}>
                              <input
                                type="checkbox"
                                checked={form.jobCategory.includes(category.name)}
                                onChange={() => toggleJobCategory(category.name)}
                              />
                              <span>{category.name}</span>
                            </label>
                          ))
                      ) : (
                        <span className="profile-field-hint">
                          No job categories are currently available.
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {form.jobCategory.length > 0 && (
                  <div className="profile-tag-list">
                    {form.jobCategory.map((category) => (
                      <span className="profile-tag" key={category}>
                        {category}
                        <button
                          type="button"
                          aria-label={`Remove ${category}`}
                          onClick={() => toggleJobCategory(category)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="profile-form-row">
                <label htmlFor="profile-skills">Skills</label>
                <div className="profile-skill-input">
                  <div className="profile-tag-list">
                    {form.skills.map((skill) => (
                      <span className="profile-tag" key={skill}>
                        {skill}
                        <button
                          type="button"
                          aria-label={`Remove ${skill}`}
                          onClick={() => removeSkill(skill)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      id="profile-skills"
                      type="text"
                      value={skillInput}
                      onChange={(event) => setSkillInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                          event.preventDefault();
                          addSkills(skillInput);
                        } else if (
                          event.key === "Backspace" &&
                          !skillInput &&
                          form.skills.length
                        ) {
                          removeSkill(form.skills[form.skills.length - 1]);
                        }
                      }}
                      onBlur={() => {
                        if (skillInput.trim()) addSkills(skillInput);
                      }}
                      placeholder="Type a skill and press Enter"
                    />
                  </div>
                </div>
                <span className="profile-field-hint">
                  Press Enter or comma to add a skill. Multi-word skills are supported.
                </span>
              </div>

              <div className="profile-form-row">
                <label htmlFor="profile-about">About</label>
                <textarea
                  id="profile-about"
                  value={form.about}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, about: event.target.value }))
                  }
                  rows={5}
                  placeholder="Tell employers about your experience and strengths."
                />
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

        {!isEditing && (
          <>
            <div className="title">Professional Profile</div>
            <div className="section-body professional-profile">
              <div className="profile-detail-item">
                <span className="profile-detail-label">Job Categories</span>
                <div className="profile-tag-list">
                  {userDetails.jobCategory?.length ? (
                    userDetails.jobCategory.map((category) => (
                      <span className="profile-tag" key={category}>{category}</span>
                    ))
                  ) : (
                    <span className="profile-detail-value">Not added</span>
                  )}
                </div>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">Skills</span>
                <div className="profile-tag-list">
                  {userDetails.skills?.length ? (
                    userDetails.skills.map((skill) => (
                      <span className="profile-tag" key={skill}>{skill}</span>
                    ))
                  ) : (
                    <span className="profile-detail-value">Not added</span>
                  )}
                </div>
              </div>
              <div className="profile-detail-item">
                <span className="profile-detail-label">About</span>
                <p className="profile-about-value">
                  {userDetails.about || "Add a short introduction about your experience."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
