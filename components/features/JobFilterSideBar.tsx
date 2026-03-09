"use client";

import React from "react";

const JobFilterSideBar: React.FC = () => (
  <div id="jobfilter_sidebar">
    <div className="section">
      <div className="section-title">Type of Employment</div>
      <hr />
      <div className="section-body">
        <form>
          {[
            "Full Time Jobs",
            "Part Time Jobs",
            "Remote job",
            "Internship Jobs",
            "Freelance Jobs",
            "Training Jobs",
          ].map((label, i) => (
            <div className="check-boxes-with-number" key={i}>
              <div className="check-box">
                <label>
                  <input type="checkbox" /> <span>{label}</span>
                </label>
              </div>
              <div className="number">20</div>
            </div>
          ))}
        </form>
      </div>
    </div>

    <div className="section">
      <div className="section-title">Seniority Level</div>
      <hr />
      <div className="section-body">
        <form>
          {[
            "Student Level",
            "Entry Level",
            "Mid Level",
            "Senior Level",
            "Director Level",
            "VP or above",
          ].map((label, i) => (
            <div className="check-boxes-with-number" key={i}>
              <div className="check-box">
                <label>
                  <input type="checkbox" /> <span>{label}</span>
                </label>
              </div>
              <div className="number">20</div>
            </div>
          ))}
        </form>
      </div>
    </div>

    <div className="section">
      <div className="section-title">Salary Range</div>
      <hr />
      <div className="section-body">
        <form>
          {[
            "$200 - $500",
            "$500 - $750",
            "$750 - $1000",
            "$1000 - $2000",
            "$2000 - $5000",
            "$5000+",
          ].map((label, i) => (
            <div className="check-boxes-with-number" key={i}>
              <div className="check-box">
                <label>
                  <input type="checkbox" /> <span>{label}</span>
                </label>
              </div>
              <div className="number">20</div>
            </div>
          ))}
        </form>
      </div>
    </div>
  </div>
);

export default JobFilterSideBar;

