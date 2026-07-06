"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useJobStore } from "@/store/jobStore";
import { userStore } from "@/store/userStore";
import { useStore, RootState } from "@/store/modalStore";
import PaginationComponent from "@/components/features/PaginationComponent";
import { formatAppliedDuration } from "@/lib/formatAppliedDate";
import { stripHtmlToText } from "@/lib/stripHtml";

function formatJobType(jobType?: string) {
  if (!jobType) return "";
  return jobType.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getEmployerName(employer: {
  company?: { name?: string } | null;
  userName?: string;
} | null | undefined): string {
  if (!employer) return "Unknown employer";
  return employer.company?.name?.trim() || employer.userName?.trim() || "Unknown employer";
}

export default function AppliedJobComponent() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);

  const user = userStore((state) => state.user);
  const hydrateAuth = userStore((state) => state.hydrateAuth);
  const toggleLoginModal = useStore((state: RootState) => state.toggleLoginModal);
  const openAppliedJobDetailsModal = useStore(
    (state: RootState) => state.openAppliedJobDetailsModal
  );

  const {
    applications,
    applicationsTotal,
    applicationsLimit,
    isLoadingApplications,
    fetchMyApplications,
  } = useJobStore();

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!user) return;

    setLoadError(null);
    fetchMyApplications(currentPage, 10).catch((error) => {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load applied jobs."
      );
    });
  }, [user, currentPage, fetchMyApplications]);

  function toggleMenu(id: string) {
    setOpenMenuId((current) => (current === id ? null : id));
  }

  const totalPages = Math.max(1, Math.ceil(applicationsTotal / (applicationsLimit || 10)));

  if (!user) {
    return (
      <div id="appliedjob">
        <div className="title">Applied Job</div>
        <hr />
        <div className="applied-job-empty">
          Please{" "}
          <button type="button" className="applied-job-login-link" onClick={() => toggleLoginModal?.()}>
            sign in
          </button>{" "}
          to view your applied jobs.
        </div>
      </div>
    );
  }

  return (
    <div id="appliedjob">
      <div className="title">Applied Job</div>
      <hr />

      {isLoadingApplications && applications.length === 0 ? (
        <div className="applied-job-loading">Loading applied jobs...</div>
      ) : loadError ? (
        <div className="applied-job-error">{loadError}</div>
      ) : applications.length === 0 ? (
        <div className="applied-job-empty">
          You have not applied to any jobs yet.{" "}
          <Link href="/browse-job">Browse jobs</Link>
        </div>
      ) : (
        <>
          {applications.map((application) => {
            const job = application.job;
            const title = job?.title ?? "Job unavailable";
            const location = job?.location ?? application.applicant.location ?? "—";
            const description =
              stripHtmlToText(job?.description ?? "") ||
              application.applicant.coverLetter ||
              "No description available.";
            const employerName = getEmployerName(application.employer ?? job?.postedBy);

            return (
              <div key={application._id} className="applied-job-card">
                <div className="header">
                  <div className="header-content">
                    <div className="left-side">
                      <Image
                        src={job?.image ?? "/assets/Images/digital-marketing.png"}
                        alt={title}
                        width={52}
                        height={52}
                        className="image"
                      />
                      <div className="job-meta">
                        <div className="title">{title}</div>
                        <div className="location">
                          {employerName} · {location}
                        </div>
                      </div>
                    </div>

                    <div className="right-side">
                      <button
                        type="button"
                        className="dot-text"
                        aria-label="Open job actions"
                        onClick={() => toggleMenu(application._id)}
                      />
                      {openMenuId === application._id && (
                        <div className="dot-click-open">
                          {job?._id && (
                            <Link
                              href={`/browse-job/${job._id}`}
                              className="share-content"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <div className="icon">
                                <Image src="/assets/Images/add-website.png" alt="" width={14} height={14} />
                              </div>
                              <div className="text">View Job</div>
                            </Link>
                          )}
                          <button
                            type="button"
                            className="share-content"
                            onClick={() => {
                              setOpenMenuId(null);
                              openAppliedJobDetailsModal?.(application._id);
                            }}
                          >
                            <div className="icon">
                              <Image src="/assets/Images/view-resume.png" alt="" width={14} height={14} />
                            </div>
                            <div className="text">View Details</div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="body">{description}</div>

                <div className="footer">
                  <div className="tags">
                    {job?.jobType && <span>{formatJobType(job.jobType)}</span>}
                  </div>
                  <div className="applied-duration">
                    {formatAppliedDuration(application.appliedAt)}
                  </div>
                </div>
              </div>
            );
          })}

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
