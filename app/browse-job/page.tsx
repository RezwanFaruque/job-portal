"use client";

import React, { useEffect } from "react";
import JobFilterSideBar from "@/components/features/JobFilterSideBar";
import JobSearchBannar from "@/components/features/JobSearchBannar";
import { useJobStore } from "@/store/jobStore";

export default function BrowseJobPage() {
  const { jobs, fetchJobs } = useJobStore();

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
                              <div className="dot-text" />
                            </div>

                            <div className="body">
                              <div className="job-title">{job.title}</div>
                              <div className="job-location">
                                {job.location ?? "Unknown location"}
                              </div>
                              <div className="job-description">
                                {job.description ?? "No description available."}
                              </div>
                              <div className="job-tags">
                                  <span  className="tags">
                                     {job.jobType}
                                  </span>
                               
                              </div>
                            </div>

                            <div className="footer">
                              <div className="buttons">
                                <button className="apply-now-button">Apply Now</button>
                                <button className="love-jobs-button">
                                  <i className="far fa-heart" />
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
