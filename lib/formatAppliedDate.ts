export function formatAppliedDuration(appliedAt?: string): string {
  if (!appliedAt) return "Applied recently";

  const appliedDate = new Date(appliedAt);
  if (Number.isNaN(appliedDate.getTime())) return "Applied recently";

  const diffMs = Date.now() - appliedDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Applied today";
  if (days === 1) return "Applied 1 day ago";
  if (days < 7) return `Applied ${days} days ago`;
  if (days < 14) return "Applied 1 week ago";
  if (days < 30) return `Applied ${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return "Applied 1 month ago";
  return `Applied ${Math.floor(days / 30)} months ago`;
}

export function formatAppliedDate(appliedAt?: string): string {
  if (!appliedAt) return "—";
  const date = new Date(appliedAt);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
