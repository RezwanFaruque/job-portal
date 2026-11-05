import styles from "./admin.module.css";
import AdminShell, { type AdminSection } from "./AdminShell";

interface AdminDataPageProps {
  active: Exclude<AdminSection, "overview">;
  title: string;
  description: string;
  searchLabel: string;
  columns: string[];
  emptyTitle: string;
  emptyDescription: string;
}

export default function AdminDataPage({
  active,
  title,
  description,
  searchLabel,
  columns,
  emptyTitle,
  emptyDescription,
}: AdminDataPageProps) {
  return (
    <AdminShell active={active}>
      <div className={styles.pageHeading}>
        <div>
          <div className={styles.eyebrow}>MANAGEMENT</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <button className={styles.disabledAction} type="button" disabled>
          <span aria-hidden="true">＋</span> Add {active === "applications" ? "application" : active.slice(0, -1)}
        </button>
      </div>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder={searchLabel} disabled />
          </label>
          <button className={styles.filterButton} type="button" disabled>
            <span aria-hidden="true">☷</span> Filters
          </button>
          <span className={styles.pendingTag}>Awaiting API</span>
        </div>

        <div className={styles.tableScroller}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                {columns.map((column) => <th key={column}>{column}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length}>
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon} aria-hidden="true">
                      {active === "jobs" ? "▤" : active === "users" ? "♙" : "▣"}
                    </span>
                    <h2>{emptyTitle}</h2>
                    <p>{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.tableFooter}>
          <span>No records loaded</span>
          <div>
            <button type="button" disabled aria-label="Previous page">‹</button>
            <span>—</span>
            <button type="button" disabled aria-label="Next page">›</button>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
