"use client";

import React, { useState } from "react";
import Image from "next/image";
import { APPLIED_JOBS } from "@/constants/demoJobs";

export default function AppliedJobComponent() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  function toggleMenu(id: string) {
    setOpenMenuId((current) => (current === id ? null : id));
  }

  return (
    <div id="appliedjob">
      <div className="title">Applied Job</div>
      <hr />

      {APPLIED_JOBS.map((job) => (
        <div key={job.id} className="applied-job-card">
          <div className="header">
            <div className="header-content">
              <div className="left-side">
                <Image
                  src={job.image}
                  alt={job.title}
                  width={60}
                  height={45}
                  className="image"
                />
                <div className="job-meta">
                  <div className="title">{job.title}</div>
                  <div className="location">{job.location}</div>
                </div>
              </div>

              <div className="right-side">
                <button
                  type="button"
                  className="dot-text"
                  aria-label="Open job actions"
                  onClick={() => toggleMenu(job.id)}
                />
                {openMenuId === job.id && (
                  <div className="dot-click-open">
                    <div className="share-content">
                      <div className="icon">
                        <Image src="/assets/Images/copy-link.png" alt="" width={10} height={10} />
                      </div>
                      <div className="text">Copy Link</div>
                    </div>
                    <div className="share-content">
                      <div className="icon">
                        <Image src="/assets/Images/add-website.png" alt="" width={10} height={10} />
                      </div>
                      <div className="text">Share Job</div>
                    </div>
                    <div className="share-content">
                      <div className="icon">
                        <Image src="/assets/Images/view-resume.png" alt="" width={10} height={10} />
                      </div>
                      <div className="text">View Details</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="body">{job.description}</div>

          <div className="footer">
            <div className="tags">
              <span>{job.jobType}</span>
            </div>
            <div className="applied-duration">{job.appliedDuration}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
