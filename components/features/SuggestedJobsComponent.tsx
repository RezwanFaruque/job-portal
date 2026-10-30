"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore, RootState } from "@/store/modalStore";
import { Job } from "@/store/jobStore";
import { jobApi } from "@/services/api";
import { getPosterDisplayName } from "@/lib/jobPoster";
import { stripHtmlToText } from "@/lib/stripHtml";
import PaginationComponent from "@/components/features/PaginationComponent";

interface JobListResponse {
  data: {
    total: number;
    jobs: Job[];
  };
}

const JOBS_PER_PAGE = 10;

function formatJobType(jobType?: string) {
  if (!jobType) return "";
  return jobType.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SuggestedJobsComponent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const openApplyJobModal = useStore((state: RootState) => state.openApplyJobModal);

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(JOBS_PER_PAGE),
        });
        const response = await jobApi.get<JobListResponse>(
          `/get-jobs?${params.toString()}`
        );

        if (!active) return;
        setJobs(response.data.jobs ?? []);
        setTotalJobs(response.data.total ?? 0);
      } catch (error) {
        if (!active) return;
        setJobs([]);
        setTotalJobs(0);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load suggested jobs."
        );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadJobs();
    return () => {
      active = false;
    };
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalJobs / JOBS_PER_PAGE));

  return (
    <section id="suggestedjob" aria-labelledby="suggested-jobs-title">
      <div className="suggested-jobs-heading">
        <div>
          <h1 id="suggested-jobs-title">Suggested Jobs</h1>
          <p>Explore the latest job opportunities available on the platform.</p>
        </div>
        <Link href="/browse-job" className="suggested-jobs-browse-link">
          Browse all jobs
        </Link>
      </div>

      {isLoading ? (
        <div className="suggested-jobs-state" role="status">
          Loading suggested jobs...
        </div>
      ) : loadError ? (
        <div className="suggested-jobs-state suggested-jobs-error" role="alert">
          {loadError}
        </div>
      ) : jobs.length === 0 ? (
        <div className="suggested-jobs-state">
          No jobs are available right now. Please check back later or{" "}
          <Link href="/browse-job">browse all jobs</Link>.
        </div>
      ) : (
        <>
          <div className="suggested-jobs-count">
            {totalJobs} {totalJobs === 1 ? "opportunity" : "opportunities"}
          </div>

          <div className="suggested-jobs-list">
            {jobs.map((job) => (
              <article className="suggested-job-card" key={job._id}>
                <div className="suggested-job-card-header">
                  <div className="suggested-job-company-mark" aria-hidden="true">
                    {getPosterDisplayName(job.postedBy).charAt(0).toUpperCase()}
                  </div>
                  <div className="suggested-job-meta">
                    <h2>{job.title}</h2>
                    <p>
                      {getPosterDisplayName(job.postedBy)} <span aria-hidden="true">·</span>{" "}
                      {job.location || "Location not specified"}
                    </p>
                  </div>
                </div>

                <p className="suggested-job-description">
                  {stripHtmlToText(job.description) || "No description available."}
                </p>

                <div className="suggested-job-footer">
                  <div className="suggested-job-tags">
                    {job.jobType && <span>{formatJobType(job.jobType)}</span>}
                    {job.salaryRange && <span>{job.salaryRange}</span>}
                  </div>
                  <div className="suggested-job-actions">
                    <Link href={`/browse-job/${job._id}`}>View details</Link>
                    <button
                      type="button"
                      onClick={() =>
                        openApplyJobModal?.({
                          id: job._id,
                          title: job.title,
                          location: job.location,
                          employerId: job.postedBy?._id,
                        })
                      }
                    >
                      Apply now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}
