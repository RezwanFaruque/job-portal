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

type SidebarIconName =
  | "profile"
  | "build"
  | "view"
  | "upload"
  | "applied"
  | "saved"
  | "suggested"
  | "search"
  | "blog"
  | "password"
  | "help"
  | "logout";

function SidebarIcon({ name }: { name: SidebarIconName }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  let artwork: React.ReactNode;
  switch (name) {
    case "profile":
      artwork = <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" /></>;
      break;
    case "build":
      artwork = <><rect x="4" y="3.5" width="16" height="17" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /><path d="m16.5 15.5 1 1 2-2" /></>;
      break;
    case "view":
      artwork = <><path d="M2.8 12s3.2-6 9.2-6 9.2 6 9.2 6-3.2 6-9.2 6-9.2-6-9.2-6Z" /><circle cx="12" cy="12" r="2.6" /></>;
      break;
    case "upload":
      artwork = <><path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></>;
      break;
    case "applied":
      artwork = <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>;
      break;
    case "saved":
      artwork = <><path d="M20.5 8.8c0 4.2-8.5 10-8.5 10s-8.5-5.8-8.5-10A4.3 4.3 0 0 1 12 6.3a4.3 4.3 0 0 1 8.5 2.5Z" /></>;
      break;
    case "suggested":
      artwork = <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M17 14v6m-3-3h6" /></>;
      break;
    case "search":
      artwork = <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>;
      break;
    case "blog":
      artwork = <><path d="M5 19V5h14v14H5Z" /><path d="M8 9h8M8 12h8M8 15h5" /><path d="M8 2v3m8-3v3" /></>;
      break;
    case "password":
      artwork = <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></>;
      break;
    case "help":
      artwork = <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.5 1.5c-1.1 1.1-2.1 1.4-2.1 3M12 17h.01" /></>;
      break;
    case "logout":
      artwork = <><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" /><path d="M14 8l4 4-4 4m4-4H8" /></>;
      break;
  }

  return (
    <svg
      className="sidebar-icon-svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
      {...commonProps}
    >
      {artwork}
    </svg>
  );
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
                <SidebarIcon name="profile" />
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
            <div className={`link-with-logo ${isActive("/build-resume")}`}>
              <div className="logo">
                <SidebarIcon name="build" />
              </div>
              <div className="links">
                <Link href="/build-resume">Build Resume</Link>
              </div>
            </div>

            <div className={`link-with-logo ${isActive("/view-resume")}`}>
              <div className="logo">
                <SidebarIcon name="view" />
              </div>
              <div className="links">
                <Link href="/view-resume">View Resume</Link>
              </div>
            </div>

            <div className={`link-with-logo ${isActive("/upload-resume")}`}>
              <div className="logo">
                <SidebarIcon name="upload" />
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
                <SidebarIcon name="applied" />
              </div>
              <div className="links">
                <Link href="/applied-job">Applied Job</Link>
              </div>
            </div>

            <div className={`link-with-logo ${isActive("/save-for-later")}`}>
              <div className="logo">
                <SidebarIcon name="saved" />
              </div>
              <div className="links">
                <Link href="/save-for-later">Save for later</Link>
              </div>
            </div>

            <div className={`link-with-logo ${isActive("/suggested-job")}`}>
              <div className="logo">
                <SidebarIcon name="suggested" />
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
                <SidebarIcon name="search" />
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
                <SidebarIcon name="blog" />
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
                <SidebarIcon name="password" />
              </div>
              <div className="links">
                <Link href="/change-password">Change Password</Link>
              </div>
            </div>

            <div className="link-with-logo">
              <div className="logo">
                <SidebarIcon name="help" />
              </div>
              <div className="links">
                <Link href="/help">Help</Link>
              </div>
            </div>

            <div className="link-with-logo">
              <div className="logo">
                <SidebarIcon name="logout" />
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
