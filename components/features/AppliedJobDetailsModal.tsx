"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useStore, RootState } from "@/store/modalStore";
import { useJobStore } from "@/store/jobStore";
import { formatAppliedDate, formatAppliedDuration } from "@/lib/formatAppliedDate";
import { getJobServiceAssetUrl } from "@/lib/jobServiceUrl";
import { getPosterDisplayName } from "@/lib/jobPoster";

function formatLabel(value?: string) {
  if (!value) return "—";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getEmployerName(
  employer: {
    company?: { name?: string } | null;
    userName?: string;
  } | null | undefined
): string {
  if (!employer) return "Unknown employer";
  return employer.company?.name?.trim() || employer.userName?.trim() || "Unknown employer";
}

export default function AppliedJobDetailsModal() {
  const selectedApplicationId = useStore((state: RootState) => state.selectedApplicationId);
  const closeAppliedJobDetailsModal = useStore(
    (state: RootState) => state.closeAppliedJobDetailsModal
  );

  const selectedApplication = useJobStore((state) => state.selectedApplication);
  const isLoadingApplicationDetails = useJobStore(
    (state) => state.isLoadingApplicationDetails
  );
  const fetchApplicationDetails = useJobStore((state) => state.fetchApplicationDetails);
  const clearSelectedApplication = useJobStore((state) => state.clearSelectedApplication);

  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedApplicationId) return;

    setLoadError(null);
    fetchApplicationDetails(selectedApplicationId)
      .then((application) => {
        if (!application) {
          setLoadError("Application not found.");
        }
      })
      .catch((error) => {
        setLoadError(
          error instanceof Error ? error.message : "Failed to load application details."
        );
      });

    return () => clearSelectedApplication();
  }, [selectedApplicationId, fetchApplicationDetails, clearSelectedApplication]);

  if (!selectedApplicationId) return null;

  const { applicant, job, employer } = selectedApplication ?? {};
  const employerName =
    getEmployerName(employer) ||
    getPosterDisplayName(job?.postedBy ?? undefined);
  const resumeUrl = applicant
    ? getJobServiceAssetUrl(applicant.resumeUrl || applicant.resume)
    : "";
  const applicantName = applicant
    ? `${applicant.firstName} ${applicant.lastName}`.trim()
    : "";

  return (
    <div
      className="modal-overlay"
      onClick={() => closeAppliedJobDetailsModal?.()}
      role="presentation"
    >
      <div
        id="appliedjob-details-modal"
        className="appliedjob-details-modal-wrapper"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="applied-job-details-title"
      >
        <button
          type="button"
          className="apply-modal-close"
          aria-label="Close application details"
          onClick={() => closeAppliedJobDetailsModal?.()}
        >
          ×
        </button>

        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              {isLoadingApplicationDetails && !selectedApplication ? (
                <div className="applied-job-loading">Loading application details...</div>
              ) : loadError || !selectedApplication ? (
                <div className="applied-job-error">{loadError ?? "Application not found."}</div>
              ) : (
                <>
                  <div className="applied-details-header">
                    <div className="applied-details-title" id="applied-job-details-title">
                      {job?.title ?? "Job unavailable"}
                    </div>
                    <div className="applied-details-subtitle">
                      {employerName}
                      {job?.location ? ` · ${job.location}` : ""}
                    </div>
                    <div className="applied-details-meta">
                      {formatAppliedDuration(selectedApplication.appliedAt)} ·{" "}
                      {formatAppliedDate(selectedApplication.appliedAt)}
                    </div>
                  </div>

                  <div className="applied-details-grid">
                    <div className="applied-details-section">
                      <div className="section-title">Your Application</div>
                      <div className="section-info">
                        <p>
                          <strong>Name:</strong> {applicantName}
                        </p>
                        <p>
                          <strong>Email:</strong> {applicant.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {applicant.phone}
                        </p>
                        <p>
                          <strong>Location:</strong> {applicant.location}
                        </p>
                        {resumeUrl && (
                          <p>
                            <strong>Resume:</strong>{" "}
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                              Download resume
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="applied-details-section">
                      <div className="section-title">Job Summary</div>
                      <div className="section-info">
                        <p>
                          <strong>Category:</strong> {job?.category?.name ?? "—"}
                        </p>
                        <p>
                          <strong>Salary:</strong> {job?.salaryRange ?? "—"}
                        </p>
                        <p>
                          <strong>Job Type:</strong> {formatLabel(job?.jobType)}
                        </p>
                        <p>
                          <strong>Vacancy:</strong> {job?.vacancy ?? "—"}
                        </p>
                        <p>
                          <strong>Employer:</strong> {employerName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="applied-details-section">
                    <div className="section-title">Cover Letter</div>
                    <div className="section-info cover-letter">{applicant.coverLetter}</div>
                  </div>

                  {job?.description && (
                    <div className="applied-details-section">
                      <div className="section-title">Job Description</div>
                      <div
                        className="section-info job-description-html"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                    </div>
                  )}

                  {job?._id && (
                    <div className="applied-details-actions">
                      <Link
                        href={`/browse-job/${job._id}`}
                        className="applied-details-job-link"
                        onClick={() => closeAppliedJobDetailsModal?.()}
                      >
                        View Full Job Posting
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
