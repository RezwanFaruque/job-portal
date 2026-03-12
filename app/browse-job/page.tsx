"use client";

import React from "react";
import JobFilterSideBar from "@/components/features/JobFilterSideBar";
import JobSearchBannar from "@/components/features/JobSearchBannar";

export default function BrowseJobPage() {
  return (
    <div id="browse-job-page">
        <JobSearchBannar />
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                <JobFilterSideBar />
                </div>
                <div className="col-md-9">
                    <div id="browse_job">
                        <div className="title-with-filter">
                        <div className="title"><span>All Jobs</span> 780 Result</div>
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
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="browse-job-card">
                                <div className="header">
                                    <div className="images">
                                    <img
                                        src="/assets/Images/digital-marketing.png"
                                        alt=""
                                    />
                                    </div>
                                    <div className="dot-text"></div>
                                </div>
                                <div className="body">
                                    <div className="job-title">Product Designer</div>
                                    <div className="job-location">Washington, United State</div>
                                    <div className="job-description">
                                    Vestibulum blandit viverra convallis. Pellentesque ligula
                                    urna, fermentum ut semper in, tincidunt nec dui. Morbi mauris
                                    lacus, consequat eget justo in, semper gravida enim. Donec
                                    ultrices varius ligula semper gravida enim. Donec ultrices….
                                    </div>
                                    <div className="job-tags">
                                    <span className="tags">Full Time</span>
                                    <span className="tags">Min 3 Years</span>
                                    <span className="tags">Senior Level</span>
                                    </div>
                                </div>
                                <div className="footer">
                                    <div className="buttons">
                                    <button className="apply-now-button">Apply Now</button>
                                    <button className="love-jobs-button">
                                        <i className="far fa-heart"></i>
                                    </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div>
                                
                                </div>
                            </div>
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
