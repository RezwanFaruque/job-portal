"use client";

import React from "react";
import { useJobStore } from "@/store/jobStore";

const EMPLOYMENT_TYPES = [
  ["full-time", "Full Time Jobs"],
  ["part-time", "Part Time Jobs"],
  ["remote", "Remote job"],
  ["internship", "Internship Jobs"],
  ["freelance", "Freelance Jobs"],
  ["training", "Training Jobs"],
] as const;
const SENIORITY_LEVELS = [
  ["student-level", "Student Level"],
  ["entry-level", "Entry Level"],
  ["mid-level", "Mid Level"],
  ["senior-level", "Senior Level"],
  ["director-level", "Director Level"],
  ["vp-or-above", "VP or above"],
] as const;
const SALARY_RANGES = [
  "$200 - $500",
  "$500 - $750",
  "$750 - $1000",
  "$1000 - $2000",
  "$2000 - $5000",
  "$5000+",
] as const;

const JobFilterSideBar: React.FC = () => {
  const searchFilters = useJobStore((state) => state.searchFilters);
  const toggleSearchFilter = useJobStore((state) => state.toggleSearchFilter);

  function renderOptions(
    options: ReadonlyArray<readonly [string, string]>,
    filter: "jobTypes" | "seniorityLevels" | "salaryRanges"
  ) {
    return options.map(([value, label]) => (
      <div className="check-boxes-with-number" key={value}>
        <div className="check-box">
          <label>
            <input
              type="checkbox"
              checked={searchFilters[filter].includes(value)}
              onChange={() => toggleSearchFilter(filter, value)}
            />{" "}
            <span>{label}</span>
          </label>
        </div>
      </div>
    ));
  }

  return (
    <div id="jobfilter_sidebar">
      <div className="section">
        <div className="section-title">Type of Employment</div>
        <hr />
        <div className="section-body">
          <form onSubmit={(event) => event.preventDefault()}>
            {renderOptions(EMPLOYMENT_TYPES, "jobTypes")}
          </form>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Seniority Level</div>
        <hr />
        <div className="section-body">
          <form onSubmit={(event) => event.preventDefault()}>
            {renderOptions(SENIORITY_LEVELS, "seniorityLevels")}
          </form>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Salary Range</div>
        <hr />
        <div className="section-body">
          <form onSubmit={(event) => event.preventDefault()}>
            {renderOptions(
              SALARY_RANGES.map((range) => [range, range] as const),
              "salaryRanges"
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobFilterSideBar;
