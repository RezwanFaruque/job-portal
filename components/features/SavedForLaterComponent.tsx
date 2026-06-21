"use client";

import React from "react";
import Image from "next/image";
import { SAVED_JOBS } from "@/constants/demoJobs";
import { useStore, RootState } from "@/store/modalStore";

export default function SavedForLaterComponent() {
  const openApplyJobModal = useStore((state: RootState) => state.openApplyJobModal);

  return (
    <div id="save_for_later">
      <div className="title">Save for later</div>
      <hr />

      <div className="save-for-later-body">
        <div className="container">
          <div className="row">
            {SAVED_JOBS.map((job) => (
              <div key={job.id} className="col-sm-12">
                <div className="save-for-later-card">
                  <div className="header">
                    <div className="left">
                      <div className="image">
                        <Image src={job.image} alt={job.title} width={57} height={43} />
                      </div>
                      <div className="job-meta">
                        <div className="job-title">{job.title}</div>
                        <div className="job-location">{job.location}</div>
                      </div>
                    </div>
                    <div className="right">
                      <button type="button" className="dot-button" aria-label="Open job options" />
                    </div>
                  </div>

                  <div className="body">
                    <div className="job-des">{job.description}</div>
                    <div className="tags">
                      <span>{job.jobType}</span>
                    </div>
                  </div>

                  <div className="footer">
                    <div className="apply-button">
                      <button
                        type="button"
                        onClick={() =>
                          openApplyJobModal?.({
                            id: job.id,
                            title: job.title,
                            location: job.location,
                          })
                        }
                      >
                        Apply Now
                      </button>
                    </div>
                    <div className="love-icon">
                      <Image
                        src="/assets/Images/saved-later.png"
                        alt="Saved job"
                        width={23}
                        height={23}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
