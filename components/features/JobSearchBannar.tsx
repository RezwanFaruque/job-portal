"use client";

import React, { useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";

const JobSearchBannar: React.FC = () =>{ 
  const  { categories , getCategories } = useCategoryStore();
  useEffect(() => {
    getCategories()
  },[getCategories])
 return (
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
              <option>Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id} >{category.name}</option>
              )) }
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
)}
;

export default JobSearchBannar;

