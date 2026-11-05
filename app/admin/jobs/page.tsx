import AdminDataPage from "@/components/admin/AdminDataPage";

export default function AdminJobsPage() {
  return (
    <AdminDataPage
      active="jobs"
      title="Jobs"
      description="Review, update, and manage job postings."
      searchLabel="Search jobs..."
      columns={["JOB TITLE", "EMPLOYER", "LOCATION", "STATUS", "POSTED", "ACTIONS"]}
      emptyTitle="No jobs to show"
      emptyDescription="Job records will appear here when the admin jobs API is connected."
    />
  );
}
