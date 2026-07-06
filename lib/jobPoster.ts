import type { JobPostedBy } from "@/store/jobStore";

export function getPosterDisplayName(postedBy?: JobPostedBy | null): string {
  if (!postedBy) return "Unknown employer";
  return postedBy.company?.name?.trim() || postedBy.userName?.trim() || "Unknown employer";
}

export function getPosterContactName(postedBy?: JobPostedBy | null): string | null {
  if (!postedBy?.userName?.trim()) return null;
  const companyName = postedBy.company?.name?.trim();
  if (companyName && companyName !== postedBy.userName.trim()) {
    return postedBy.userName.trim();
  }
  return null;
}
