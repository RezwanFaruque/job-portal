import type { Metadata } from "next";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = {
  title: "Admin Console | Job Portal",
  description: "Job Portal administration workspace",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.adminRoot}>{children}</div>;
}
