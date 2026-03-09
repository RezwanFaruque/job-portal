"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div>
        
        {/* Hero banner styled by assets CSS (#bannar-section / bannar.scss) */}
        <section id="bannar-section">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 d-flex align-items-center">
                <div className="left-side">
                  <h1 className="title">
                    Find Your <span>Dream Job</span> Today
                  </h1>
                  <p className="subtitle">
                    Explore thousands of job opportunities tailored to your skills and interests.
                  </p>
                  <div className="search-section">
                    <form>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Job title or keyword"
                          aria-label="Job search"
                        />
                        <button className="btn" type="submit">
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="right-side d-none d-md-block">
                  <div className="bn-image">
                    <img
                      className="bannar-vector"
                      src="/assets/images/bannar-vector.png"
                      alt="Job search illustration"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
