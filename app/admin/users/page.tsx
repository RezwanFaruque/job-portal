import AdminDataPage from "@/components/admin/AdminDataPage";

export default function AdminUsersPage() {
  return (
    <AdminDataPage
      active="users"
      title="Users"
      description="View and manage candidate and employer accounts."
      searchLabel="Search users..."
      columns={["NAME", "EMAIL", "ACCOUNT TYPE", "JOINED", "STATUS", "ACTIONS"]}
      emptyTitle="No users to show"
      emptyDescription="User records will appear here when the admin users API is connected."
    />
  );
}
