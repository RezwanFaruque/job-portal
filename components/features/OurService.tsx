"use client";

import React from "react";
import Link from "next/link";

/**
 * Placeholder component for "Our Service" section.
 * Add props and UI as needed by the design.
 */
const OurService: React.FC = () => {
  return (
    <section className="our-services">
      <div className="container">
        <div className="row">
          {/* card 1 */}
          <div className="col-lg-4 col-md-4 col-sm-12 start">
            <div className="service-card">
              <div className="header">
                <div className="icon-section">
                  <div className="icon">
                    <img
                      src="/assets/Images/our-service-one.png"
                      alt=""
                      srcSet=""
                    />
                  </div>
                </div>
              </div>
              <div className="title">Create Your Resume</div>
              <div className="short-description">
                Aenean sed nibh a magna posuere tempor. Nunc faucibus
                pellentesque nunc in aliquet. Donec congue, nunc vel tempor
                congue, enim sapien lobortis ipsum, in volutpat sem ex in ligula.
              </div>
            </div>
          </div>

          {/* card 2 */}
          <div className="col-lg-4 col-md-4 col-sm-12 middle">
            <div className="service-card">
              <div className="header">
                <div className="icon-section">
                  <div className="icon">
                    <img
                      src="/assets/Images/our-service-two.png"
                      alt=""
                      srcSet=""
                    />
                  </div>
                </div>
              </div>
              <div className="title">Apply for New Job</div>
              <div className="short-description">
                Aenean sed nibh a magna posuere tempor. Nunc faucibus
                pellentesque nunc in aliquet. Donec congue, nunc vel tempor
                congue, enim sapien lobortis ipsum, in volutpat sem ex in ligula.
              </div>
            </div>
          </div>

          {/* card 3 */}
          <div className="col-lg-4 col-md-4 col-sm-12">
            <div className="service-card">
              <div className="header">
                <div className="icon-section">
                  <div className="icon">
                    <img
                      src="/assets/Images/our-service-three.png"
                      alt=""
                      srcSet=""
                    />
                  </div>
                </div>
              </div>
              <div className="title">Need To Hire</div>
              <div className="short-description">
                Aenean sed nibh a magna posuere tempor. Nunc faucibus
                pellentesque nunc in aliquet. Donec congue, nunc vel tempor
                congue, enim sapien lobortis ipsum, in volutpat sem ex in ligula.
              </div>
              <div className="footer">
                <Link href="/">Post a Job for free</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurService;
