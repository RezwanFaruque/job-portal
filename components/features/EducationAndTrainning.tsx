"use client";

import React, { useState } from "react";

const EducationAndTrainning: React.FC = () => {
  const [editAcademic, setEditAcademic] = useState(false);
  const [editTraining, setEditTraining] = useState(false);

  const options = [
    { value: "Institute one", label: "Institute One" },
    { value: "Institute Two", label: "Institute Two" },
  ];

  return (
    <div id="personal_info">
      <div className="accordion" role="tablist">
        {/* Education */}
        <div className="tab-sections">
          <header className="p-1 title-with-toggle" role="tab">
            <div className="title">Education &amp; Trainning</div>
            <div className="toggle-icon">
              <i className="fas fa-chevron-down" />
            </div>
          </header>
          <div className="collapse-body" id="edu-trainning">
            <div className="academic-info">
              <div className="title-with-button">
                <div className="title">Academic 01</div>
                <div className="button">
                  <button
                    onClick={() => setEditAcademic((v) => !v)}
                    className="edit-button"
                    type="button"
                  >
                    Edit
                  </button>
                  <button className="delete-button" type="button">
                    Delete
                  </button>
                </div>
              </div>

              {editAcademic ? (
                <div className="form-academic-edit">
                  <form>
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div className="mb-3" key={idx}>
                            <label className="form-label">Select *</label>
                            <select className="form-select">
                              {options.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div className="mb-3" key={idx}>
                            <label className="form-label">Select *</label>
                            <select className="form-select">
                              {options.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="buttons">
                          <button type="submit" className="save">
                            save
                          </button>
                          <button
                            type="button"
                            className="close"
                            onClick={() => setEditAcademic(false)}
                          >
                            close
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="academic-details">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="info">
                        <div className="title">Institute</div>
                        <div className="inf">
                          - Noakhali Science &amp; Technology University
                        </div>
                      </div>
                      <div className="info">
                        <div className="title">Exam/Degree Title</div>
                        <div className="inf">- Bachelor of Science .BSc</div>
                      </div>
                      <div className="info">
                        <div className="title">Department/Group/Major</div>
                        <div className="inf">- Information Technology</div>
                      </div>
                      <div className="info">
                        <div className="title">Level of Education</div>
                        <div className="inf">- Bachelor / Honors</div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="info">
                        <div className="title">Result</div>
                        <div className="inf">- 3.75 out of 4.00</div>
                      </div>
                      <div className="info">
                        <div className="title">Passing Year</div>
                        <div className="inf">- 2021</div>
                      </div>
                      <div className="info">
                        <div className="title">Duration</div>
                        <div className="inf">- 4 Years</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Academic 02 static form */}
            <div className="academic-input">
              <div className="title">Academic 02</div>
              <form>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div className="mb-3" key={idx}>
                        <label className="form-label">Select *</label>
                        <select className="form-select">
                          {options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div className="mb-3" key={idx}>
                        <label className="form-label">Select *</label>
                        <select className="form-select">
                          {options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
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

        {/* Training */}
        <div className="tab-sections">
          <header className="p-1 title-with-toggle" role="tab">
            <div className="title">Training</div>
            <div className="toggle-icon">
              <i className="fas fa-chevron-down" />
            </div>
          </header>
          <div className="collapse-body" id="trainning-one">
            <div className="academic-info">
              <div className="title-with-button">
                <div className="title">Training 01</div>
                <div className="button">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => setEditTraining((v) => !v)}
                  >
                    Edit
                  </button>
                  <button type="button" className="delete-button">
                    Delete
                  </button>
                </div>
              </div>

              {editTraining ? (
                <div className="form-academic-edit">
                  <form>
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div className="mb-3" key={idx}>
                            <label className="form-label">Select *</label>
                            <select className="form-select">
                              {options.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div className="mb-3" key={idx}>
                            <label className="form-label">Select *</label>
                            <select className="form-select">
                              {options.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="buttons">
                          <button type="submit" className="save">
                            save
                          </button>
                          <button
                            type="button"
                            className="close"
                            onClick={() => setEditTraining(false)}
                          >
                            close
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="academic-details">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="info">
                        <div className="title">Training Title</div>
                        <div className="inf">- UI/UX Design</div>
                      </div>
                      <div className="info">
                        <div className="title">Institute</div>
                        <div className="inf">- Jobpot</div>
                      </div>
                      <div className="info">
                        <div className="title">Topics Covered</div>
                        <div className="inf">
                          - Adobe XD, Adobe Photoshop, Adobe Indesign
                        </div>
                      </div>
                      <div className="info">
                        <div className="title">Location</div>
                        <div className="inf">- Dhaka, Bangladesh</div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="info">
                        <div className="title">Country</div>
                        <div className="inf">- Bangladesh</div>
                      </div>
                      <div className="info">
                        <div className="title">Training Year</div>
                        <div className="inf">- 2020</div>
                      </div>
                      <div className="info">
                        <div className="title">Duration</div>
                        <div className="inf">- 1 Year</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Training 02 static form */}
            <div className="academic-input trainning-input">
              <div className="title">Training 02</div>
              <form>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div className="mb-3" key={idx}>
                        <label className="form-label">Select *</label>
                        <select className="form-select">
                          {options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div className="mb-3" key={idx}>
                        <label className="form-label">Select *</label>
                        <select className="form-select">
                          {options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
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
};

export default EducationAndTrainning;

