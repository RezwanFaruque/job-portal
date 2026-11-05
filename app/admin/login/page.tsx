"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "@/components/admin/admin.module.css";

export default function AdminLoginPage() {
  const [notice, setNotice] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(true);
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <Link className={styles.loginBrand} href="/" aria-label="Job Portal home">
          <span className={styles.brandMark}>J</span>
          <span>
            <strong>Job Portal</strong>
            <small>ADMIN CONSOLE</small>
          </span>
        </Link>
        <div className={styles.loginIntro}>
          <span className={styles.loginIcon} aria-hidden="true">⌑</span>
          <div className={styles.eyebrow}>SECURE WORKSPACE</div>
          <h1>Welcome back</h1>
          <p>Sign in with your administrator account to continue.</p>
        </div>

        {notice && (
          <div className={styles.loginNotice} role="status">
            Admin sign-in isn’t connected yet. Configure an admin authentication
            endpoint before enabling access.
          </div>
        )}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            placeholder="admin@example.com"
            autoComplete="username"
            required
          />
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <button type="submit">Continue to admin</button>
        </form>

        <div className={styles.loginFootnote}>
          <span className={styles.statusDot} />
          Admin authentication setup required
        </div>
      </section>
      <div className={styles.loginCopyright}>© Job Portal · Administration</div>
    </main>
  );
}
