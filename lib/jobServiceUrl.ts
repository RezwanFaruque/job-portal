const JOB_API_BASE =
  process.env.NEXT_PUBLIC_JOB_API_URL ?? "http://localhost:5001/api/jobs";

const JOB_SERVICE_ORIGIN = JOB_API_BASE.replace(/\/api\/jobs\/?$/, "");

export function getJobServiceAssetUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${JOB_SERVICE_ORIGIN}${normalized}`;
}
