"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userStore } from "@/store/userStore";
import type { SocialLinkPlatform, SocialLinks } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";
import SocialLinkModal from "@/components/features/SocialLinkModal";

const EMPTY_SOCIAL_LINKS: SocialLinks = {};

const SOCIAL_LINK_OPTIONS: {
  platform: SocialLinkPlatform;
  label: string;
  image?: string;
  iconText?: string;
}[] = [
  { platform: "website", label: "Website", image: "/assets/Images/add-website.png" },
  { platform: "facebook", label: "Facebook", image: "/assets/Images/facebook.png" },
  { platform: "twitter", label: "Twitter", image: "/assets/Images/twitter.png" },
  { platform: "linkedin", label: "LinkedIn", iconText: "in" },
  { platform: "googlePlus", label: "Google+", image: "/assets/Images/google.png" },
];

interface LeftSideBarProps {
  activePath?: string;
}

const LeftSideBar: React.FC<LeftSideBarProps> = ({ activePath = "" }) => {
  const router = useRouter();
  const logout = userStore((state) => state.logout);
  const socialLinks = userStore(
    (state) => state.userDetails?.socialLinks ?? state.user?.socialLinks ?? EMPTY_SOCIAL_LINKS
  );
  const [editingSocialLink, setEditingSocialLink] =
    useState<SocialLinkPlatform | null>(null);
  const closeSocialLinkModal = useCallback(
    () => setEditingSocialLink(null),
    []
  );
  const editingSocialOption = SOCIAL_LINK_OPTIONS.find(
    (item) => item.platform === editingSocialLink
  );

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
            <div className={`link-with-logo ${isActive("/view-resume")}`}>
              <div className="logo">
                <img className="logo-img" src="/assets/Images/view-resume.png" alt="" />
              </div>
              <div className="links">
                <Link href="/view-resume">View Resume</Link>
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

            <div className={`link-with-logo ${isActive("/suggested-job")}`}>
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
            <div className={`link-with-logo ${isActive("/change-password")}`}>
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
            {SOCIAL_LINK_OPTIONS.map((item) => {
              const value = socialLinks[item.platform];
              return (
                <div className="link-with-logo social-link-option" key={item.platform}>
                  <div className="logo">
                    {item.image ? (
                      <img className="logo-img" src={item.image} alt="" />
                    ) : (
                      <span className="social-link-text-icon" aria-hidden="true">
                        {item.iconText}
                      </span>
                    )}
                  </div>
                  <button
                    className="links special social-link-edit"
                    type="button"
                    aria-label={`${value ? "Edit" : "Add"} ${item.label} link`}
                    onClick={() => setEditingSocialLink(item.platform)}
                  >
                    <span className="social-link-label">
                      {value ? item.label : `Add ${item.label} link`}
                      {value && <span className="social-link-saved-url">{value}</span>}
                    </span>
                    <span className="plus-right" aria-hidden="true">
                      {value ? "Edit" : "+"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {editingSocialLink && editingSocialOption && (
        <SocialLinkModal
          platform={editingSocialLink}
          label={editingSocialOption.label}
          value={socialLinks[editingSocialLink] ?? ""}
          onClose={closeSocialLinkModal}
        />
      )}
    </div>
  );
};

export default LeftSideBar;
