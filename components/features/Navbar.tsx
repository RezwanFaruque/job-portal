"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => (
  <div id="section-navbar">
    <div className="navbar">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link href="/" className="navbar-brand">
              <Image
                src="/assets/images/mainlogo.png"
                alt="Logo"
                width={120}
                height={40}
              />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={false}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/browse-job">Browse a Job</Link>
              </li>
              <li className="nav-item">
                <Link href="/post-job/primary-job-information">Post A Job</Link>
              </li>
              <li className="nav-item">
                <Link href="/">Build/Upload Resume</Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
              <li className="nav-item spec">
                <Link href="/post-job/primary-job-information">Post A Job</Link>
              </li>
              <li className="nav-item">
                <button type="button">Sign in</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </div>
);

export default Navbar;

