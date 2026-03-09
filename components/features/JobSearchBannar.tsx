"use client";

import React from "react";

const JobSearchBannar: React.FC = () => (
  <div id="job_search_bannar">
    <div className="bannar-layer">
      <div className="title">10,000 Job Listed Here!!!</div>
      <div className="subtitle">Your dream job is waitng</div>
    </div>
    <div className="search-bar-section">
      <form>
        <div className="search-bar-bannar">
          <div className="search-by keyword">
            <div className="search-icon">
              <i className="fas fa-search" />
            </div>
            <div className="input">
              <input
                className="form-control"
                placeholder="Search by job keyword"
                required
              />
            </div>
          </div>

          <div className="search-by category">
            <select className="form-select">
              <option>Categories</option>
            </select>
          </div>

          <div className="search-by job-type">
            <select className="form-select">
              <option>Job Type</option>
            </select>
          </div>

          <div className="search-by postal-code">
            <div className="postal-icon">
              <i className="fas fa-map-marker-alt" />
            </div>
            <div className="input">
              <input
                className="form-control"
                placeholder="City or Postal code"
                required
              />
            </div>
          </div>

          <div className="submit-button">
            <button className="find-job" type="submit">
              Find Job
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);

export default JobSearchBannar;

