"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RootState, useStore } from "@/store/modalStore";
import { userStore } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";
import ProfileAvatar from "@/components/features/ProfileAvatar";

const Navbar: React.FC = () => {
  const toggleLoginModal = useStore((state: RootState) => state.toggleLoginModal);
  const toggleSignupModal = useStore((state: RootState) => state.toggleSignupModal);
  const showSignupModal = useStore((state: RootState) => state.showSignupModal);

  const user = userStore((state) => state.user);
  const logout = userStore((state) => state.logout);
  const hydrateAuth = userStore((state) => state.hydrateAuth);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setProfileOpen(false);
    useToastStore.getState().showToast("Logged out successfully");
  }

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

                {user ? (
                  <li className="nav-item" ref={profileRef}>
                    <div className="loggedin-profile-info">
                      <div className="profile">
                        <div className="button">
                          <button
                            type="button"
                            className="profile-trigger"
                            aria-expanded={profileOpen}
                            aria-haspopup="true"
                            onClick={() => setProfileOpen((open) => !open)}
                          >
                            <ProfileAvatar
                              src={user.profilePicture}
                              alt={`${user.userName} avatar`}
                              width={36}
                              height={36}
                              className="profile-avatar"
                            />
                            <span className="profile-username">{user.userName}</span>
                          </button>

                          {profileOpen && (
                            <div className="button-open-section-profile">
                              <div className="section">
                                <div className="icon">
                                  <Image
                                    src="/assets/Images/personal-info.png"
                                    alt=""
                                    width={15}
                                    height={15}
                                  />
                                </div>
                                <div className="link">
                                  <Link href="/profile" onClick={() => setProfileOpen(false)}>
                                    User Profile
                                  </Link>
                                </div>
                              </div>
                              <div className="section">
                                <div className="icon">
                                  <Image
                                    src="/assets/Images/signout.png"
                                    alt=""
                                    width={15}
                                    height={15}
                                  />
                                </div>
                                <div className="link">
                                  <button
                                    type="button"
                                    className="logout-button"
                                    onClick={handleLogout}
                                  >
                                    Logout
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li className="nav-item">
                    <button
                      type="button"
                      className="nav-link btn btn-link"
                      onClick={() => {
                        if (showSignupModal && toggleSignupModal) toggleSignupModal();
                        if (toggleLoginModal) toggleLoginModal();
                      }}
                    >
                      Sign in
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
