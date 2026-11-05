"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./admin.module.css";

export type AdminSection = "overview" | "jobs" | "users" | "applications";

const navigation: { key: AdminSection; label: string; icon: string; href: string }[] = [
  { key: "overview", label: "Overview", icon: "⌂", href: "/admin" },
  { key: "jobs", label: "Jobs", icon: "▤", href: "/admin/jobs" },
  { key: "users", label: "Users", icon: "♙", href: "/admin/users" },
  {
    key: "applications",
    label: "Applications",
    icon: "▣",
    href: "/admin/applications",
  },
];

export default function AdminShell({
  active,
  children,
}: {
  active: AdminSection;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function signOut() {
    router.push("/admin/login");
  }

  return (
    <div className={styles.adminApp}>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <Link className={styles.brand} href="/admin" aria-label="Job Portal admin home">
          <span className={styles.brandMark}>J</span>
          <span>
            <strong>Job Portal</strong>
            <small>ADMIN CONSOLE</small>
          </span>
        </Link>

        <div className={styles.navCaption}>WORKSPACE</div>
        <nav className={styles.navigation} aria-label="Admin navigation">
          {navigation.map((item) => (
            <Link
              className={`${styles.navLink} ${active === item.key ? styles.navActive : ""}`}
              href={item.href}
              key={item.key}
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.navIcon} aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
              {item.key === "applications" && (
                <span className={styles.navSoon}>API</span>
              )}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminIdentity}>
            <span className={styles.avatar}>A</span>
            <span>
              <strong>Administrator</strong>
              <small>Admin account</small>
            </span>
          </div>
          <button className={styles.signOutButton} type="button" onClick={signOut}>
            <span aria-hidden="true">↪</span> Sign out
          </button>
        </div>
      </aside>

      {menuOpen && (
        <button
          className={styles.mobileScrim}
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className={styles.mainColumn}>
        <header className={styles.topbar}>
          <button
            className={styles.menuButton}
            type="button"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={styles.breadcrumb}>
            <span>Workspace</span>
            <span className={styles.breadcrumbDivider}>/</span>
            <strong>
              {navigation.find((item) => item.key === active)?.label ?? "Overview"}
            </strong>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.environmentBadge}>
              <span /> UI PREVIEW
            </span>
            <span className={styles.topbarAvatar}>A</span>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.previewNotice}>
            <span className={styles.noticeIcon} aria-hidden="true">i</span>
            <p>
              Admin preview only. Sign-in, role checks, and live data require an
              admin API integration.
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
