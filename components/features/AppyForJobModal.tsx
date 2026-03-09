"use client";

import React from "react";

const AppyForJobModal: React.FC = () => (
  <div className="applyforjobmodal-placeholder">
    <div className="header">Apply for UI/UX to Company Name</div>
    <hr />
    <div className="body">
      <div className="header">
        <div className="title">Contact Info</div>
        <div className="profile-info">
          <div className="profile-image">
            <img src="/personal-info-profile.png" alt="" />
          </div>
          <div className="other-info">
            <div className="name">MD JANE ALAM</div>
            <div className="designation">UI/UX Designer</div>
          </div>
        </div>
      </div>
      <div className="form">
        <form>
          <div className="input-section">
            <label>Email</label>
            <input className="email" type="email" name="Email" />
          </div>

          <div className="input-section">
            <label>Contact</label>
            <input className="email" type="text" name="contact" />
          </div>

          <div className="input-section">
            <label>Country</label>
            <select>
              <option>Bangladesh</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
              <option>Algeria</option>
            </select>
          </div>

          <div className="input-section">
            <label>Upload Resume</label>
            <div className="resume">
              <div className="upload-section">
                <div className="pdf-thumb-border" />
                <button type="button">Upload</button>
              </div>
            </div>
          </div>

          <div className="input-section accept-term">
            <div className="d-flex">
              <input type="checkbox" />
              <span className="agreed-term">
                I accept the terms &amp; conditions
              </span>
            </div>
          </div>

          <button type="submit" className="button-submit">
            ApplyNow
          </button>
        </form>
      </div>
    </div>
  </div>
);

export default AppyForJobModal;

