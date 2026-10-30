"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSavedJobStore } from "@/store/savedJobStore";
import { useStore, RootState } from "@/store/modalStore";
import { useToastStore } from "@/store/toastStore";
import { getPosterDisplayName } from "@/lib/jobPoster";
import { stripHtmlToText } from "@/lib/stripHtml";
import PaginationComponent from "@/components/features/PaginationComponent";

const SAVED_JOBS_PER_PAGE = 10;

function formatJobType(jobType?: string) {
  if (!jobType) return "";
  return jobType.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SavedForLaterComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const savedJobs = useSavedJobStore((state) => state.savedJobs);
  const savedJobsTotal = useSavedJobStore((state) => state.savedJobsTotal);
  const isLoadingSavedJobs = useSavedJobStore((state) => state.isLoadingSavedJobs);
  const savedJobsError = useSavedJobStore((state) => state.savedJobsError);
  const pendingSavedJobIds = useSavedJobStore((state) => state.pendingSavedJobIds);
  const fetchSavedJobs = useSavedJobStore((state) => state.fetchSavedJobs);
  const removeSavedJob = useSavedJobStore((state) => state.removeSavedJob);
  const openApplyJobModal = useStore((state: RootState) => state.openApplyJobModal);
  const totalPages = Math.max(1, Math.ceil(savedJobsTotal / SAVED_JOBS_PER_PAGE));

  useEffect(() => {
    void fetchSavedJobs(currentPage, SAVED_JOBS_PER_PAGE).catch(() => undefined);
  }, [currentPage, fetchSavedJobs]);

  async function handleRemove(jobId: string) {
    try {
      await removeSavedJob(jobId);
      useToastStore.getState().showToast("Job removed from saved jobs.");
      const nextTotal = useSavedJobStore.getState().savedJobsTotal;
      const nextTotalPages = Math.max(
        1,
        Math.ceil(nextTotal / SAVED_JOBS_PER_PAGE)
      );
      if (currentPage > nextTotalPages) setCurrentPage(nextTotalPages);
    } catch (error) {
      useToastStore
        .getState()
        .showToast(
          error instanceof Error ? error.message : "Unable to remove saved job.",
          "error"
        );
    }
  }

  return (
    <div id="save_for_later">
      <h1 className="title">Saved Jobs</h1>
      <hr />

      {isLoadingSavedJobs ? (
        <div className="saved-jobs-state" role="status">Loading saved jobs...</div>
      ) : savedJobsError ? (
        <div className="saved-jobs-state saved-jobs-error" role="alert">
          {savedJobsError}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="saved-jobs-state">
          You haven&apos;t saved any jobs yet. <Link href="/browse-job">Browse jobs</Link> to find
          your next opportunity.
        </div>
      ) : (
        <>
          <div className="saved-jobs-count">
            {savedJobsTotal} {savedJobsTotal === 1 ? "saved job" : "saved jobs"}
          </div>

          <div className="save-for-later-body">
            {savedJobs.map((job) => (
              <article key={job._id} className="save-for-later-card">
                <div className="header">
                  <div className="left">
                    <div className="saved-job-mark" aria-hidden="true">
                      {getPosterDisplayName(job.postedBy).charAt(0).toUpperCase()}
                    </div>
                    <div className="job-meta">
                      <Link className="job-title" href={`/browse-job/${job._id}`}>
                        {job.title}
                      </Link>
                      <div className="job-location">
                        {getPosterDisplayName(job.postedBy)} · {job.location || "Location not specified"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="remove-saved-job"
                    aria-label={`Remove ${job.title} from saved jobs`}
                    disabled={pendingSavedJobIds.includes(job._id)}
                    onClick={() => void handleRemove(job._id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="body">
                  <p className="job-des">
                    {stripHtmlToText(job.description) || "No description available."}
                  </p>
                  <div className="tags">
                    {job.jobType && <span>{formatJobType(job.jobType)}</span>}
                    {job.salaryRange && <span>{job.salaryRange}</span>}
                  </div>
                </div>

                <div className="footer">
                  <Link href={`/browse-job/${job._id}`} className="saved-job-details-link">
                    View details
                  </Link>
                  <button
                    type="button"
                    className="saved-job-apply-button"
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
    </div>
  );
}
