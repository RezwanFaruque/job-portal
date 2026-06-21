"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userStore } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";

interface LeftSideBarProps {
  activePath?: string;
}

const LeftSideBar: React.FC<LeftSideBarProps> = ({ activePath = "" }) => {
  const router = useRouter();
  const logout = userStore((state) => state.logout);

  function isActive(path: string) {
    return activePath === path ? "active" : "";
  }

  function handleLogout() {
    logout();
    useToastStore.getState().showToast("Logged out successfully");
    router.push("/");
  }

  return (
    <div id="left-sidebar">
      <div className="left-sidebar">
        <div className="section">
          <div className="title">
            Profile Details
            <div className="togglehideleftbar" />
          </div>
          <div className="links">
            <div className={`link-with-logo ${isActive("/profile")}`}>
              <div className="logo">
                <img
                  className="logo-img"
                  src="/assets/Images/personal-info.png"
                  alt=""
                />
              </div>
              <div className="links">
                <Link className="left-link" href="/profile">
                  Personal Information
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="title">Resume</div>
          <div className="links">
            <div className="link-with-logo">
              <div className="logo">
                <img className="logo-img" src="/assets/Images/view-resume.png" alt="" />
              </div>
              <div className="links">
                <Link href="/">View Resume</Link>
              </div>
            </div>

            <div className="link-with-logo">
              <div className="logo">
                <img className="logo-img" src="/assets/Images/edit-resume.png" alt="" />
              </div>
              <div className="links">
                <Link href="/edit-resume">Edit Resume</Link>
              </div>
            </div>

            <div className={`link-with-logo ${isActive("/upload-resume")}`}>
              <div className="logo">
                <img className="logo-img" src="/assets/Images/upload-resume.png" alt="" />
              </div>
              <div className="links">
                <Link href="/upload-resume">Upload Resume</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="title">My Job</div>
          <div className="links">
            <div className={`link-with-logo ${isActive("/applied-job")}`}>
              <div className="logo">
                <img className="logo-img" src="/assets/Images/applied-job.png" alt="" />
              </div>
              <div className="links">
                <Link href="/applied-job">Applied Job</Link>
              </div>
            </div>

            <div className={`link-with-logo ${isActive("/save-for-later")}`}>
              <div className="logo">
                <img className="logo-img" src="/assets/Images/save-for-later.png" alt="" />
              </div>
              <div className="links">
                <Link href="/save-for-later">Save for later</Link>
              </div>
            </div>

            <div className="link-with-logo">
              <div className="logo">
                <img className="logo-img" src="/assets/Images/suggested-job.png" alt="" />
              </div>
              <div className="links">
                <Link href="/suggested-job">Suggested Jobs</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="title">Search Job</div>
          <div className="links">
            <div className="link-with-logo">
              <div className="logo">
                <img className="logo-img" src="/assets/Images/search-job.png" alt="" />
              </div>
              <div className="links">
                <Link href="/browse-job">Search Job</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="title">Our Blog</div>
          <div className="links">
            <div className="link-with-logo">
              <div className="logo">
                <img className="logo-img" src="/assets/Images/blog.png" alt="" />
              </div>
              <div className="links">
                <Link href="/our-blog">Blog</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="title">Account Setting</div>
          <div className="links">
            <div className="link-with-logo">
              <div className="logo">
                <img className="logo-img" src="/assets/Images/change-password.png" alt="" />
              </div>
              <div className="links">
                <Link href="/change-password">Change Password</Link>
              </div>
            </div>

            <div className="link-with-logo">
              <div className="logo">
                <img className="logo-img" src="/assets/Images/help.png" alt="" />
              </div>
              <div className="links">
                <Link href="/help">Help</Link>
              </div>
            </div>

            <div className="link-with-logo">
              <div className="logo">
                <img className="logo-img" src="/assets/Images/signout.png" alt="" />
              </div>
              <div className="links">
                <button type="button" className="sidebar-logout-button" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="title">Social Link</div>
          <div className="links">
            {[
              { img: "/assets/Images/add-website.png", text: "Add Website" },
              { img: "/assets/Images/facebook.png", text: "Add facebook link" },
              { img: "/assets/Images/twitter.png", text: "Add twitter link" },
              { img: "/assets/Images/twitter.png", text: "Add LinkedIn link" },
              { img: "/assets/Images/google.png", text: "Add Google+ link" },
            ].map((item, index) => (
              <div className="link-with-logo" key={index}>
                <div className="logo">
                  <img className="logo-img" src={item.img} alt="" />
                </div>
                <div className="links special">
                  <Link href="/">{item.text}</Link>
                  <div className="plus-right">+</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
