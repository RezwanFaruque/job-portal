"use client";

import React, { useEffect } from "react";
import JobFilterSideBar from "@/components/features/JobFilterSideBar";
import JobSearchBannar from "@/components/features/JobSearchBannar";
import JobCardMenu from "@/components/features/JobCardMenu";
import { useJobStore } from "@/store/jobStore";
import { useStore, RootState } from "@/store/modalStore";

export default function BrowseJobPage() {
  const { jobs, fetchJobs } = useJobStore();
  const openApplyJobModal = useStore((state: RootState) => state.openApplyJobModal);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div id="browse-job-page" className="layout-body">
      <JobSearchBannar />
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <JobFilterSideBar />
          </div>
          <div className="col-md-9">
            <div id="browse_job">
              <div className="title-with-filter">
                <div className="title">
                  <span>All Jobs</span> {jobs.length} Result
                </div>
                <div className="filter">
                  <select className="custom-select">
                    <option value="">Sort By:Newest Post</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Lowest Salary">Lowest Salary</option>
                    <option value="Most Applied">Most Applied</option>
                    <option value="Less Applied">Less Applied</option>
                  </select>
                </div>
              </div>

              <div className="job-results">
                <div className="container">
                  <div className="row">
                    {jobs.length === 0 ? (
                      <div className="col-12">
                        <div className="no-results">No jobs found.</div>
                      </div>
                    ) : (
                      jobs.map((job) => (
                        <div
                          key={job._id}
                          className="col-lg-4 col-md-6 col-sm-12"
                        >
                          <div className="browse-job-card">
                            <div className="header">
                              <div className="images">
                                <img
                                  src={job.image ?? "/assets/Images/digital-marketing.png"}
                                  alt={job.title}
                                />
                              </div>
                              <JobCardMenu jobId={job._id} />
                            </div>

                            <div className="body">
                              <div className="job-title">{job.title}</div>
                              <div className="job-location">
                                {job.location ?? "Unknown location"}
                              </div>
                              <div className="job-description">
                                {job.description ?? "No description available."}
                              </div>
                              {job.jobType && (
                                <div className="job-tags">
                                  <span className="tags">{job.jobType}</span>
                                </div>
                              )}
                            </div>

                            <div className="footer">
                              <div className="buttons">
                                <button
                                  type="button"
                                  className="apply-now-button"
                                  onClick={() =>
                                    openApplyJobModal?.({
                                      id: job._id,
                                      title: job.title,
                                      location: job.location,
                                    })
                                  }
                                >
                                  Apply Now
                                </button>
                                <button
                                  type="button"
                                  className="love-jobs-button"
                                  aria-label="Save job"
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M12 21s-7.5-4.7-9.9-9.1C.2 8.3 2.2 5 5.5 5c1.7 0 3.3.8 4.5 2.1C11.2 5.8 12.8 5 14.5 5 17.8 5 19.8 8.3 21.9 11.9 19.5 16.3 12 21 12 21z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
