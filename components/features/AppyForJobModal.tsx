"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useStore, RootState } from "@/store/modalStore";
import { userStore } from "@/store/userStore";
import ProfileAvatar from "@/components/features/ProfileAvatar";
import { useToastStore } from "@/store/toastStore";

const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function splitUserName(userName?: string) {
  if (!userName) return { firstName: "", lastName: "" };
  const parts = userName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export default function ApplyForJobModal() {
  const closeApplyJobModal = useStore((state: RootState) => state.closeApplyJobModal);
  const selectedApplyJob = useStore((state: RootState) => state.selectedApplyJob);
  const user = userStore((state) => state.user);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedApplyJob) return;
    setResumeFile(null);
    setAcceptedTerms(false);
    setError(null);
  }, [selectedApplyJob]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Please accept the terms & conditions to continue.");
      return;
    }

    if (!resumeFile) {
      setError("Please upload your resume before applying.");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 600));
      useToastStore.getState().showToast(
        `Application submitted for ${selectedApplyJob?.title ?? "this job"}!`
      );
      closeApplyJobModal?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleResumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
      setError("Resume must be a PDF, DOC, or DOCX file.");
      return;
    }

    if (file.size > 500 * 1024) {
      setError("Resume must be less than 500 KB.");
      return;
    }

    setResumeFile(file);
    setError(null);
  }

  if (!selectedApplyJob) return null;

  const { firstName, lastName } = splitUserName(user?.userName);

  return (
    <div className="modal-overlay">
      <div id="applyforjobmodal" className="applyforjobmodal-wrapper">
        <div className="modal-dialog">
          <div className="modal-content">
            <button
              type="button"
              className="apply-modal-close"
              aria-label="Close apply modal"
              onClick={() => closeApplyJobModal?.()}
            >
              ×
            </button>
            <div className="modal-body">
              <div className="header">
                Apply for {selectedApplyJob.title}
                {selectedApplyJob.location ? ` — ${selectedApplyJob.location}` : ""}
              </div>
              <hr />

              <div className="body">
                <div className="header">
                  <div className="title">Applicant Information</div>
                  {user && (
                    <div className="profile-info">
                      <div className="profile-image">
                        <ProfileAvatar
                          src={user.profilePicture}
                          alt={user.userName}
                          width={70}
                          height={70}
                        />
                      </div>
                      <div className="other-info">
                        <div className="name">{user.userName}</div>
                        <div className="designation">
                          {user.userType.replace(/_/g, " ")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form">
                  {error && <div className="apply-form-error">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="input-section form-row">
                      <div className="form-field">
                        <label htmlFor="apply-first-name">First Name</label>
                        <input
                          id="apply-first-name"
                          type="text"
                          name="firstName"
                          defaultValue={firstName}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="apply-last-name">Last Name</label>
                        <input
                          id="apply-last-name"
                          type="text"
                          name="lastName"
                          defaultValue={lastName}
                          required
                        />
                      </div>
                    </div>

                    <div className="input-section">
                      <label htmlFor="apply-email">Email</label>
                      <input
                        id="apply-email"
                        className="email"
                        type="email"
                        name="email"
                        defaultValue={user?.email ?? ""}
                        required
                      />
                    </div>

                    <div className="input-section">
                      <label htmlFor="apply-phone">Phone</label>
                      <input
                        id="apply-phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div className="input-section">
                      <label htmlFor="apply-location">Location</label>
                      <input
                        id="apply-location"
                        type="text"
                        name="location"
                        placeholder="City, Country"
                        defaultValue={selectedApplyJob.location ?? ""}
                        required
                      />
                    </div>

                    <div className="input-section">
                      <label htmlFor="apply-cover-letter">Cover Letter</label>
                      <textarea
                        id="apply-cover-letter"
                        name="coverLetter"
                        rows={4}
                        placeholder="Write a short cover letter for this role..."
                        required
                      />
                    </div>

                    <div className="input-section">
                      <label>Upload Resume</label>
                      <div className="resume">
                        <div className="upload-section">
                          <div className="pdf-thumb-border">
                            <Image
                              src="/assets/Images/upload-icon-resume.png"
                              alt="Resume upload"
                              width={40}
                              height={48}
                            />
                            <div className="filename">
                              {resumeFile ? resumeFile.name : "No file selected"}
                            </div>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            hidden
                            onChange={handleResumeChange}
                          />
                          <button type="button" onClick={() => fileInputRef.current?.click()}>
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="input-section accept-term">
                      <div className="d-flex">
                        <input
                          id="apply-terms"
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(event) => setAcceptedTerms(event.target.checked)}
                        />
                        <label htmlFor="apply-terms" className="agreed-term">
                          I accept the terms &amp; conditions
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="button-submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Apply Now"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
