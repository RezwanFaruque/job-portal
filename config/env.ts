/**
 * Validate and expose env vars. Add validation as needed.
 */

export const env = {
  /** Express API base URL (direct or /api/backend for proxy) */
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "/api/backend",
  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;
