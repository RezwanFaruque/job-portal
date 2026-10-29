"use client";

import React, { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useJobStore } from "@/store/jobStore";

const JOB_TYPE_OPTIONS = [
  ["full-time", "Full Time"],
  ["part-time", "Part Time"],
  ["remote", "Remote"],
  ["internship", "Internship"],
  ["freelance", "Freelance"],
  ["training", "Training"],
];

interface JobSearchFormProps {
  categories: ReturnType<typeof useCategoryStore.getState>["categories"];
  searchFilters: ReturnType<typeof useJobStore.getState>["searchFilters"];
  setSearchFilters: ReturnType<typeof useJobStore.getState>["setSearchFilters"];
}

function JobSearchForm({
  categories,
  searchFilters,
  setSearchFilters,
}: JobSearchFormProps) {
  const [keyword, setKeyword] = useState(searchFilters.keyword);
  const [category, setCategory] = useState(searchFilters.category);
  const [location, setLocation] = useState(searchFilters.location);
  const jobType = searchFilters.jobTypes[0] ?? "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchFilters({ keyword, category, location });
  }

  return (
    <div className="search-bar-section">
      <form onSubmit={handleSubmit}>
        <div className="search-bar-bannar">
          <div className="search-by keyword">
            <div className="search-icon">
              <i className="fas fa-search" />
            </div>
            <div className="input">
              <input
                className="form-control"
                placeholder="Search by job keyword"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
          </div>

          <div className="search-by category">
            <select
              className="form-select"
              value={category}
              onChange={(event) => {
                const nextCategory = event.target.value;
                setCategory(nextCategory);
                setSearchFilters({ category: nextCategory });
              }}
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-by job-type">
            <select
              className="form-select"
              value={jobType}
              onChange={(event) =>
                setSearchFilters({
                  jobTypes: event.target.value ? [event.target.value] : [],
                })
              }
            >
              <option value="">Job Type</option>
              {JOB_TYPE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
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
                value={location}
                onChange={(event) => setLocation(event.target.value)}
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
  );
}

const JobSearchBannar: React.FC = () => {
  const categories = useCategoryStore((state) => state.categories);
  const getCategories = useCategoryStore((state) => state.getCategories);
  const searchFilters = useJobStore((state) => state.searchFilters);
  const setSearchFilters = useJobStore((state) => state.setSearchFilters);
  const searchFormVersion = useJobStore((state) => state.searchFormVersion);

  useEffect(() => {
    getCategories().catch((error: unknown) => {
      console.error("Failed to load job categories", error);
    });
  }, [getCategories]);

  return (
    <div id="job_search_bannar">
      <div className="bannar-layer">
        <div className="title">10,000 Job Listed Here!!!</div>
        <div className="subtitle">Your dream job is waitng</div>
      </div>
      <JobSearchForm
        key={searchFormVersion}
        categories={categories}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
      />
    </div>
  );
};

export default JobSearchBannar;
