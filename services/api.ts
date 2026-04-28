/**
 * API clients for two backend services.
 *
 * Configure in `.env.local`:
 * - NEXT_PUBLIC_USER_API_URL=http://localhost:5000/api/users
 * - NEXT_PUBLIC_JOB_API_URL=http://localhost:5001/api/jobs
 */

const JOB_BASE_URL =
  process.env.NEXT_PUBLIC_JOB_API_URL ?? "http://localhost:5001/api/jobs";
const USER_BASE_URL =
  process.env.NEXT_PUBLIC_USER_API_URL ?? "http://localhost:5000/api/users";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") ?? "";

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${text}`);
  }

  if (contentType.includes("application/json")) {
    return res.json();
  }

  const text = await res.text();
  throw new Error(`Expected JSON response but received: ${text.slice(0, 120)}`);
}

async function request<T, B = unknown>(
  baseUrl: string,
  endpoint: string,
  method: HttpMethod,
  body?: B
): Promise<T> {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  return handleResponse<T>(res);
}

function createApiClient(baseUrl: string) {
  return {
    get: <T>(endpoint: string) => request<T>(baseUrl, endpoint, "GET"),
    post: <T, B = unknown>(endpoint: string, body: B) =>
      request<T, B>(baseUrl, endpoint, "POST", body),
    put: <T, B = unknown>(endpoint: string, body: B) =>
      request<T, B>(baseUrl, endpoint, "PUT", body),
    del: <T>(endpoint: string) => request<T>(baseUrl, endpoint, "DELETE"),
  };
}

export const jobApi = createApiClient(JOB_BASE_URL);
export const userApi = createApiClient(USER_BASE_URL);
