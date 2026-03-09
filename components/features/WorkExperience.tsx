"use client";

import React from "react";

const WorkExperience: React.FC = () => (
  <div id="work_experience">
    <div className="accordion" role="tablist">
      <div className="tab-sections">
        <header className="p-1 title-with-toggle" role="tab">
          <div className="title">Add workexperiences</div>
          <div className="toggle-icon">
            <i className="fas fa-chevron-down" />
          </div>
        </header>
        <div className="collapse-body" id="work-experience">
          <div className="workexp-info">
            <div className="title-with-button">
              <div className="title">Experience 1</div>
              <div className="button">
                <button className="edit-button" type="button">
                  Edit
                </button>
                <button className="delete-button" type="button">
                  Delete
                </button>
              </div>
            </div>

            <div className="workexp-details">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="info">
                    <div className="title">Company Name</div>
                    <div className="inf">- Abc Company</div>
                  </div>

                  <div className="info">
                    <div className="title">Company Business</div>
                    <div className="inf">- IT FIRM</div>
                  </div>

                  <div className="info">
                    <div className="title">Company Location</div>
                    <div className="inf">- Dhaka,Bangladesh</div>
                  </div>

                  <div className="info">
                    <div className="title">Employment Period</div>
                    <div className="inf">- 01/01/2019 to Continue</div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="info">
                    <div className="title">Responsibilities</div>
                    <div className="inf">- UI/UX Expert</div>
                  </div>
                  <div className="info">
                    <div className="title">Designation</div>
                    <div className="inf">-Senior UI/UX Designer</div>
                  </div>
                  <div className="info">
                    <div className="title">Department</div>
                    <div className="inf">- Technical</div>
                  </div>
                  <div className="info">
                    <div className="title">Area of s</div>
                    <div className="inf" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="workexp-input">
            <div className="title">Experience 02</div>
            <form>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  {[
                    "Company Name*",
                    "Company Business *",
                    "Designation *",
                    "Department*",
                    "Area Of Experiences (max 3)",
                  ].map((label, i) => (
                    <div className="mb-3" key={i}>
                      <label className="form-label">{label}</label>
                      <input className="form-control" />
                    </div>
                  ))}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="mb-3">
                    <label className="form-label">Responsibilities*</label>
                    <input className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company Location*</label>
                    <input className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Period*</label>
                    <div className="period">
                      <input
                        className="form-control"
                        placeholder="From"
                        type="date"
                      />
                      <input
                        className="form-control"
                        placeholder="To"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="buttons">
                    <button type="submit" className="save">
                      save
                    </button>
                    <button type="button" className="close">
                      close
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default WorkExperience;

