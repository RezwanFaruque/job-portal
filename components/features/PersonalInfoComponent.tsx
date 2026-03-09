"use client";

import React from "react";

const PersonalInfoComponent: React.FC = () => (
  <div id="personal_info">
    <div className="accordion" role="tablist">
      <div className="tab-sections">
        <header className="p-1 title-with-toggle" role="tab">
          <div className="title">Personal Details</div>
          <div className="toggle-icon">
            <i className="fas fa-chevron-down" />
          </div>
        </header>
        <div className="collapse-body" id="personal-information">
          <form>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="side-form left">
                  <div className="mb-3">
                    <label className="form-label">First Name*</label>
                    <input id="firstname" type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Father&apos;s Name*</label>
                    <input id="fathersname" type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date of Birth*</label>
                    <input id="dob" type="date" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Marital Status*</label>
                    <input id="married" type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nationality*</label>
                    <input id="nation" type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Passport Number*</label>
                    <input id="p_number" type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile Number*</label>
                    <input id="m_number" type="text" className="form-control" />
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="side-form right">
                  <div className="mb-3">
                    <label className="form-label">Last Name*</label>
                    <input id="lastname" type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mother&apos;s Name*</label>
                    <input id="mothername" type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender*</label>
                    <select className="form-select">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Religion*</label>
                    <input id="religion" type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">NID NO.(if have)</label>
                    <input id="nid" type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Passport Issue Date</label>
                    <input id="pssissuedate" type="date" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email*</label>
                    <input id="email" type="email" className="form-control" />
                  </div>
                </div>
              </div>

              <div className="col-sm-12">
                <div className="buttons">
                  <button className="save" type="submit">
                    Save
                  </button>
                  <button className="close" type="button">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="tab-sections">
        <header className="p-1 title-with-toggle" role="tab">
          <div className="title">Address Details</div>
          <div className="toggle-icon">
            <i className="fas fa-chevron-down" />
          </div>
        </header>
        <div className="collapse-body" id="address-details">
          <form>
            <div className="row mb-3">
              <div className="col-sm-12">
                <div className="title">Present Address*</div>
              </div>
              {[1, 2, 3].map((i) => (
                <div className="col-lg-4 col-md-6 col-sm-12" key={`present-${i}`}>
                  <select className="form-select">
                    <option>Select District</option>
                    <option>District one</option>
                    <option>District Two</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="row mb-3">
              <div className="col-sm-12">
                <div className="title">Permanant Address*</div>
              </div>
              {[1, 2, 3].map((i) => (
                <div className="col-lg-4 col-md-6 col-sm-12" key={`perm-${i}`}>
                  <select className="form-select">
                    <option>Select District</option>
                    <option>District one</option>
                    <option>District Two</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="buttons second">
                  <button className="save" type="submit">
                    Save
                  </button>
                  <button className="close" type="button">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="tab-sections">
        <header className="p-1 title-with-toggle" role="tab">
          <div className="title">Career &amp; Job Application</div>
          <div className="toggle-icon">
            <i className="fas fa-chevron-down" />
          </div>
        </header>
        <div className="collapse-body" id="career-job-application">
          <form>
            <div className="row">
              <div className="col-sm-12">
                <div className="title">Objective*</div>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Write here....."
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="buttons second">
                  <button className="save" type="submit">
                    Save
                  </button>
                  <button className="close" type="button">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

export default PersonalInfoComponent;

