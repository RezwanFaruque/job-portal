"use client";

import React from "react";

const Bannar: React.FC = () => (
  <div id="bannar-section">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="left-side">
            <div className="title">
              The Easiest Way to Get Your New Test <span>JOB</span>
            </div>
            <div className="subtitle">
              Aenean sed nibh a magna posuere tempor.
              <br />
              Nunc faucibus pellentesque nunc in aliquet.
              <br />
              Donec congue, nunc vel tempor congue, enim sapien lobortis ipsum,
              in volutpat sem ex in ligula.
              <br />
              Nunc purus est.
            </div>
            <div className="search-section">
              <form>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    aria-label="Job search"
                  />
                  <button className="search-banner" type="submit">
                    Search Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="right-side">
            <div className="bn-image">
              <img className="bannar-vector" src="/bannar-vector.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Bannar;

