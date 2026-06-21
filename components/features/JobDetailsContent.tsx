"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useJobStore } from "@/store/jobStore";
import { useStore, RootState } from "@/store/modalStore";

interface JobDetailsContentProps {
  jobId: string;
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatLabel(value?: string) {
  if (!value) return "—";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function JobDetailsContent({ jobId }: JobDetailsContentProps) {
  const jobDetails = useJobStore((state) => state.jobDetails);
  const isLoadingDetails = useJobStore((state) => state.isLoadingDetails);
  const fetchJobDetails = useJobStore((state) => state.fetchJobDetails);
  const clearJobDetails = useJobStore((state) => state.clearJobDetails);
  const openApplyJobModal = useStore((state: RootState) => state.openApplyJobModal);

  useEffect(() => {
    fetchJobDetails(jobId).catch(console.error);
    return () => clearJobDetails();
  }, [jobId, fetchJobDetails, clearJobDetails]);

  if (isLoadingDetails && !jobDetails) {
    return (
      <div id="job-details">
        <div className="container">
          <div className="job-details-loading">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div id="job-details">
        <div className="container">
          <div className="job-details-error">
            Unable to load job details.{" "}
            <Link href="/browse-job">Back to jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="job-details">
      <div className="container">
        <div className="job-details-main-section">
          <div className="main-images-section">
            <Image
              src="/assets/Images/job-search-layer.png"
              alt=""
              width={1200}
              height={262}
              className="job-details-banner"
              priority
            />
            <div className="main-image-icon">
              <Image
                src="/assets/Images/digital-marketing.png"
                alt={jobDetails.postedBy.userName}
                width={80}
                height={80}
              />
            </div>
          </div>

          <div className="header">
            <div className="left">
              <div className="title">{jobDetails.title}</div>
              <div className="subtitle">
                {jobDetails.postedBy.userName} · {jobDetails.location}
              </div>
              <div className="posting-date">Posted on {formatDate(jobDetails.createdAt)}</div>
            </div>
            <div className="right">
              <div className="details">
                <button type="button" className="love-job" aria-label="Save job">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 21s-7.5-4.7-9.9-9.1C.2 8.3 2.2 5 5.5 5c1.7 0 3.3.8 4.5 2.1C11.2 5.8 12.8 5 14.5 5 17.8 5 19.8 8.3 21.9 11.9 19.5 16.3 12 21 12 21z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="details-applicants">
                <div className="applicants">Vacancy: {jobDetails.vacancy}</div>
                <div className="deadline">{formatLabel(jobDetails.jobType)}</div>
              </div>
            </div>
          </div>

          <div className="other-detials">
            <div className="section">
              <div className="title">Category</div>
              <div className="info">{jobDetails.category?.name ?? "—"}</div>
            </div>
            <div className="section">
              <div className="title">Salary</div>
              <div className="info">{jobDetails.salaryRange || "—"}</div>
            </div>
            <div className="section">
              <div className="title">Job Type</div>
              <div className="info">{formatLabel(jobDetails.jobType)}</div>
            </div>
            <div className="section">
              <div className="title">Location</div>
              <div className="info">{jobDetails.location}</div>
            </div>
          </div>

          <div className="main-detials">
            <div className="section">
              <div className="title">Job Description</div>
              <div className="info">{jobDetails.description}</div>
            </div>

            <div className="section">
              <div className="title">Posted By</div>
              <div className="info">
                {jobDetails.postedBy.userName} ({jobDetails.postedBy.email})
              </div>
            </div>

            <div className="section">
              <div className="apply-button">
                <button
                  type="button"
                  onClick={() =>
                    openApplyJobModal?.({
                      id: jobDetails._id,
                      title: jobDetails.title,
                      location: jobDetails.location,
                    })
                  }
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
