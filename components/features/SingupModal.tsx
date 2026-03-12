"use client";

import React from "react";
import { useStore, RootState } from "../../store/useStore";

const SingupModal: React.FC = () => {
  const toggleSignup = useStore((state: RootState) => state.toggleSignupModal);
  const toggleLogin = useStore((state: RootState) => state.toggleLoginModal);

  return (
    <div className="modal-overlay">
      <div className="signup-modal-placeholder">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title" id="SignUpModalLabel">
              Sign Up
            </div>
          </div>
          <div className="signup-form-with-tab">
            <div className="tab-section">
              <div className="job-seeker-form">
                <form>
                  <div className="form-row first-row">
                    <input className="first-name" type="text" placeholder="First Name" />
                    <input className="last-name" type="text" placeholder="Last Name" />
                  </div>
                  <div className="form-row">
                    <input className="email" type="email" placeholder="Email" />
                  </div>
                  <div className="form-row">
                    <input className="password" type="password" placeholder="Password" />
                  </div>
                  <div className="form-row">
                    <input
                      className="password"
                      type="password"
                      placeholder="Confirm Password"
                    />
                  </div>
                  <div className="submit-button">
                    <button type="submit" className="signup">
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>

              <div className="company-form">
                <form>
                  <div className="form-row">
                    <input
                      className="company-name"
                      type="text"
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="form-row">
                    <select>
                      <option>Company Type</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <input
                      className="company-eamil"
                      type="email"
                      placeholder="Company Email"
                    />
                  </div>
                  <div className="form-row">
                    <input
                      className="company-password"
                      type="password"
                      placeholder="Company Password"
                    />
                  </div>
                  <div className="form-row">
                    <input
                      className="password"
                      type="password"
                      placeholder="Confirm Password"
                    />
                  </div>
                  <div className="company-form-submit">
                    <button type="submit" className="button-submit">
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="footer-signup-modal">
              <div className="text">Already have an account?</div>
              <div className="signinlink">
                <button
                  className="open-login-button"
                  onClick={() => {
                    if (toggleSignup) toggleSignup();
                    if (toggleLogin) toggleLogin();
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingupModal;
