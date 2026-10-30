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
  const setSearchFilters = useJobStore((state) => state.setSearchFilters);
  const resetSearchForm = useJobStore((state) => state.resetSearchForm);
  const activeFilterCount =
    searchFilters.jobTypes.length +
    searchFilters.seniorityLevels.length +
    searchFilters.salaryRanges.length;

  function renderOptions(
    options: ReadonlyArray<readonly [string, string]>,
    filter: "jobTypes" | "seniorityLevels" | "salaryRanges"
  ) {
    return options.map(([value, label]) => (
      <label className="check-boxes-with-number" key={value}>
          <span className="check-box">
            <input
              type="checkbox"
              checked={searchFilters[filter].includes(value)}
              onChange={() => toggleSearchFilter(filter, value)}
            />
          </span>
          <span className="filter-option-label">{label}</span>
      </label>
    ));
  }

  return (
    <div id="jobfilter_sidebar">
      <div className="filter-sidebar-header">
        <div>
          <span className="filter-sidebar-eyebrow">Refine your search</span>
          <h2>Filters</h2>
        </div>
        <span className="filter-count" aria-label={`${activeFilterCount} active filters`}>
          {activeFilterCount}
        </span>
      </div>
      {activeFilterCount > 0 && (
        <button
          type="button"
          className="clear-filters-button"
          onClick={() => {
            setSearchFilters({
              keyword: "",
              category: "",
              location: "",
              jobTypes: [],
              seniorityLevels: [],
              salaryRanges: [],
            });
            resetSearchForm();
          }}
        >
          Clear all filters
        </button>
      )}
      <div className="section">
        <div className="section-title">Type of Employment</div>
        <div className="section-body">
          {renderOptions(EMPLOYMENT_TYPES, "jobTypes")}
        </div>
      </div>

      <div className="section">
        <div className="section-title">Seniority Level</div>
        <div className="section-body">
          {renderOptions(SENIORITY_LEVELS, "seniorityLevels")}
        </div>
      </div>

      <div className="section">
        <div className="section-title">Salary Range</div>
        <div className="section-body">
          {renderOptions(
            SALARY_RANGES.map((range) => [range, range] as const),
            "salaryRanges"
          )}
        </div>
      </div>
    </div>
  );
};

export default JobFilterSideBar;
