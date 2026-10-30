"use client";

import React, { useEffect, useRef, useState } from "react";
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

interface SearchDropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

function SearchDropdown({
  label,
  value,
  placeholder,
  options,
  onChange,
}: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const displayedValue = options[selectedIndex]?.label ?? placeholder;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (options.length === 0) return;
      setIsOpen(true);
      requestAnimationFrame(() =>
        focusOption(
          selectedIndex >= 0
            ? selectedIndex
            : event.key === "ArrowDown"
              ? 0
              : options.length - 1
        )
      );
    }
  }

  function handleOptionKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      focusOption((index + direction + options.length) % options.length);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusOption(event.key === "Home" ? 0 : options.length - 1);
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  }

  return (
    <div className="browse-search-dropdown" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="browse-search-dropdown-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={value ? "" : "is-placeholder"}>{displayedValue}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="m3.5 6 4.5 4 4.5-4" />
        </svg>
      </button>
      {isOpen && (
        <div className="browse-search-dropdown-menu" role="listbox" aria-label={label}>
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={value === option.value}
              className={`browse-search-dropdown-option${value === option.value ? " is-selected" : ""}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
            <div className="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
            </div>
            <div className="input">
              <input
                className="form-control"
                aria-label="Job title or keyword"
                placeholder="Job title or keyword"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
          </div>

          <div className="search-by category">
            <SearchDropdown
              label="Job category"
              value={category}
              placeholder="Select category"
              options={categories.map((item) => ({
                value: item.name,
                label: item.name,
              }))}
              onChange={(nextCategory) => {
                setCategory(nextCategory);
                setSearchFilters({ category: nextCategory });
              }}
            />
          </div>

          <div className="search-by job-type">
            <SearchDropdown
              label="Employment type"
              value={jobType}
              placeholder="Job Type"
              options={JOB_TYPE_OPTIONS.map(([optionValue, label]) => ({
                value: optionValue,
                label,
              }))}
              onChange={(nextJobType) =>
                setSearchFilters({
                  jobTypes: nextJobType ? [nextJobType] : [],
                })
              }
            />
          </div>

          <div className="search-by postal-code">
            <div className="postal-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M19 10.2c0 5.1-7 11-7 11s-7-5.9-7-11a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.2" />
              </svg>
            </div>
            <div className="input">
              <input
                className="form-control"
                aria-label="City or location"
                placeholder="City or location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </div>
          </div>

          <div className="submit-button">
            <button className="find-job" type="submit">
              Search jobs <span aria-hidden="true">→</span>
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
    <section id="job_search_bannar" aria-labelledby="job-search-title">
      <div className="bannar-layer">
        <span className="job-search-eyebrow">The next step starts here</span>
        <h1 className="title" id="job-search-title">Find a role that fits your future</h1>
        <p className="subtitle">
          Search opportunities by title, category, work type, or location.
        </p>
      </div>
      <JobSearchForm
        key={searchFormVersion}
        categories={categories}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
      />
    </section>
  );
};

export default JobSearchBannar;
