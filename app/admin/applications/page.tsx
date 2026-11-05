import AdminDataPage from "@/components/admin/AdminDataPage";

export default function AdminApplicationsPage() {
  return (
    <AdminDataPage
      active="applications"
      title="Applications"
      description="Review job applications and track their status."
      searchLabel="Search applications..."
      columns={["CANDIDATE", "JOB", "EMPLOYER", "APPLIED", "STATUS", "ACTIONS"]}
      emptyTitle="No applications to show"
      emptyDescription="Application records will appear here when the admin API is connected."
    />
  );
}
