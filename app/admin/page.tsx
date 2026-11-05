import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import styles from "@/components/admin/admin.module.css";

const metrics = [
  { label: "Total jobs", icon: "▤" },
  { label: "Registered users", icon: "♙" },
  { label: "Applications", icon: "▣" },
  { label: "Pending review", icon: "◷" },
];

export default function AdminOverviewPage() {
  return (
    <AdminShell active="overview">
      <div className={styles.pageHeading}>
        <div>
          <div className={styles.eyebrow}>ADMIN WORKSPACE</div>
          <h1>Overview</h1>
          <p>Monitor activity and manage your job portal from one place.</p>
        </div>
        <span className={styles.dateLabel}>Dashboard overview</span>
      </div>

      <section className={styles.metricsGrid} aria-label="Portal summary">
        {metrics.map((metric, index) => (
          <article className={styles.metricCard} key={metric.label}>
            <div className={styles.metricTop}>
              <span>{metric.label}</span>
              <span className={`${styles.metricIcon} ${styles[`metricIcon${index}`]}`}>
                {metric.icon}
              </span>
            </div>
            <strong className={styles.metricValue}>—</strong>
            <span className={styles.metricFootnote}>Connect admin data API</span>
          </article>
        ))}
      </section>

      <section className={styles.overviewGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <h2>Recent jobs</h2>
              <p>Latest job posts across the portal</p>
            </div>
            <Link href="/admin/jobs">View jobs <span aria-hidden="true">→</span></Link>
          </div>
          <div className={styles.overviewEmpty}>
            <span className={styles.emptyIcon} aria-hidden="true">▤</span>
            <strong>No job data available</strong>
            <span>Connect the jobs API to display recent posts.</span>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <h2>New users</h2>
              <p>Recently registered accounts</p>
            </div>
            <Link href="/admin/users">View users <span aria-hidden="true">→</span></Link>
          </div>
          <div className={styles.overviewEmpty}>
            <span className={styles.emptyIcon} aria-hidden="true">♙</span>
            <strong>No user data available</strong>
            <span>Connect the users API to display new accounts.</span>
          </div>
        </article>
      </section>

      <div className={styles.setupCard}>
        <span className={styles.setupIcon} aria-hidden="true">✦</span>
        <div>
          <strong>Next step: connect the admin services</strong>
          <p>
            Configure admin authentication, permissions, and management endpoints
            before enabling changes to live records.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
