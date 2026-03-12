"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { RootState, useStore } from "@/store/useStore";

const Navbar: React.FC = () => {
  // selecting each value separately to avoid recreating object every render
  const toggleLoginModal = useStore((s: RootState) => s.toggleLoginModal);
  const toggleSignupModal = useStore((s: RootState) => s.toggleSignupModal);
  const showSignupModal = useStore((s: RootState) => s.showSignupModal);

  return (
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

            {/* Bootstrap toggler */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link href="/browse-job" className="nav-link">
                    Browse a Job
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/post-job/primary-job-information"
                    className="nav-link"
                  >
                    Post A Job
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/" className="nav-link">
                    Build/Upload Resume
                  </Link>
                </li>
              </ul>

              <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
                <li className="nav-item spec">
                  <Link
                    href="/post-job/primary-job-information"
                    className="nav-link"
                  >
                    Post A Job
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="nav-link btn btn-link"
                    onClick={() => {
                        // Close signup modal if it's open
                      if (showSignupModal && toggleSignupModal)
                        toggleSignupModal();
                      // Open login modal
                      if (toggleLoginModal) toggleLoginModal();
                    }}
                  >
                    Sign in
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;