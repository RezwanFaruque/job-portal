"use client";

import React from "react";

const Footer: React.FC = () => (
  <div id="footer">
    <div className="container">
      <div className="row">
        <div className="footer-content">
          <div className="fo-content about-us">
            <div className="title">About Us</div>
            <div className="links">
              <ul>
                <li>
                  <a className="footer-link" href="/">
                    about jobpot.com
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Feedback
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="career-resource">
            <div className="fo-content career-res">
              <div className="title">Career Resources</div>
              <div className="links">
                <ul>
                  <li>
                    <a className="footer-link" href="/">
                      Career Guide
                    </a>
                  </li>
                  <li>
                    <a className="footer-link" href="/">
                      Interview Tips
                    </a>
                  </li>
                  <li>
                    <a className="footer-link" href="/">
                      Resume Writing Tips
                    </a>
                  </li>
                  <li>
                    <a className="footer-link" href="/">
                      Cover Letter
                    </a>
                  </li>
                  <li>
                    <a className="footer-link" href="/">
                      Articles
                    </a>
                  </li>
                  <li>
                    <a className="footer-link" href="/">
                      Career Counciling
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="fo-content job-sec">
            <div className="title">Job Seekers</div>
            <div className="links">
              <ul>
                <li>
                  <a className="footer-link" href="/">
                    Create New Account
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Myjobpot
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    FAQ
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Video Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="fo-content employee">
            <div className="title">Employer</div>
            <div className="links">
              <ul>
                <li>
                  <a className="footer-link" href="/">
                    Create New Account
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Products or Services
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="fo-content so-section">
            <div className="title">Tools &amp; Social Media</div>
            <div className="links">
              <ul>
                <li>
                  <a className="footer-link" href="/">
                    about jobpot.com
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    facebook
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    linkedin
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    twitter
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Google +
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="/">
                    Youtube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="last-footer">
            <div className="title-text">Need Any Support? Call to</div>
            <div className="logo-with-phone">
              <div className="logo">
                <img
                  className="img-fluid last-footer-logo"
                  src="/last-footer-logo.png"
                  alt=""
                />
              </div>
              <div className="caller-text">+1 650-762-6683</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;

