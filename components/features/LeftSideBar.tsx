"use client";

import React from "react";
import Link from "next/link";

const LeftSideBar: React.FC = () => (
  <div id="left-sidebar">
    <div className="left-sidebar">
      <div className="section">
        <div className="title">
          Profile Details
          <div className="togglehideleftbar" />
        </div>
        <div className="links">
          <div className="link-with-logo">
            <div className="logo">
              <img className="logo-img" src="/personal-info.png" alt="" />
            </div>
            <div className="links">
              <Link className="left-link" href="/">
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
              <img className="logo-img" src="/view-resume.png" alt="" />
            </div>
            <div className="links">
              <Link href="/">View Resume</Link>
            </div>
          </div>

          <div className="link-with-logo">
            <div className="logo">
              <img className="logo-img" src="/edit-resume.png" alt="" />
            </div>
            <div className="links">
              <Link href="/edit-resume">Edit Resume</Link>
            </div>
          </div>

          <div className="link-with-logo">
            <div className="logo">
              <img className="logo-img" src="/personal-info.png" alt="" />
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
          <div className="link-with-logo">
            <div className="logo">
              <img className="logo-img" src="/applied-job.png" alt="" />
            </div>
            <div className="links">
              <Link href="/applied-job">Applied Job</Link>
            </div>
          </div>

          <div className="link-with-logo">
            <div className="logo">
              <img className="logo-img" src="/save-for-later.png" alt="" />
            </div>
            <div className="links">
              <Link href="/save-for-later">Save for later</Link>
            </div>
          </div>

          <div className="link-with-logo">
            <div className="logo">
              <img className="logo-img" src="/suggested-job.png" alt="" />
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
              <img className="logo-img" src="/search-job.png" alt="" />
            </div>
            <div className="links">
              <Link href="/">Search Job</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="title">Our Blog</div>
        <div className="links">
          <div className="link-with-logo">
            <div className="logo">
              <img className="logo-img" src="/blog.png" alt="" />
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
              <img className="logo-img" src="/change-password.png" alt="" />
            </div>
            <div className="links">
              <Link href="/change-password">Change Password</Link>
            </div>
          </div>

          <div className="link-with-logo">
            <div className="logo">
              <img className="logo-img" src="/help.png" alt="" />
            </div>
            <div className="links">
              <Link href="/help">Help</Link>
            </div>
          </div>

          <div className="link-with-logo">
            <div className="logo">
              <img className="logo-img" src="/signout.png" alt="" />
            </div>
            <div className="links">
              <Link href="/">Sign Out</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="title">Social Link</div>
        <div className="links">
          {[
            { img: "/add-website.png", text: "Add Website" },
            { img: "/facebook.png", text: "Add facebook link" },
            { img: "/twitter.png", text: "Add twitter link" },
            { img: "/twitter.png", text: "Add LinkedIn link" },
            { img: "/google.png", text: "Add Google+ link" },
          ].map((item, i) => (
            <div className="link-with-logo" key={i}>
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

export default LeftSideBar;

