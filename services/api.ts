/**
 * Base API client for Express API (in separate folder).
 * - Direct: NEXT_PUBLIC_API_URL=http://localhost:3001 (Express needs CORS)
 * - Proxy: NEXT_PUBLIC_API_URL=/api/backend + BACKEND_URL in next.config
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/backend";

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
