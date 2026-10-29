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

const AUTH_TOKEN_KEY = "auth_token";

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

async function request<T, B = unknown>(
  baseUrl: string,
  endpoint: string,
  method: HttpMethod,
  body?: B,
  withAuth = false
): Promise<T> {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: withAuth ? getAuthHeaders() : { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  return handleResponse<T>(res);
}

function createApiClient(baseUrl: string, withAuth = false) {
  return {
    get: <T>(endpoint: string) => request<T>(baseUrl, endpoint, "GET", undefined, withAuth),
    post: <T, B = unknown>(endpoint: string, body: B) =>
      request<T, B>(baseUrl, endpoint, "POST", body, withAuth),
    put: <T, B = unknown>(endpoint: string, body: B) =>
      request<T, B>(baseUrl, endpoint, "PUT", body, withAuth),
    del: <T>(endpoint: string) => request<T>(baseUrl, endpoint, "DELETE", undefined, withAuth),
  };
}

export const jobApi = createApiClient(JOB_BASE_URL);
export const jobAuthApi = createApiClient(JOB_BASE_URL, true);
export const userApi = createApiClient(USER_BASE_URL, true);

export interface ApplyJobApiResponse {
  success: boolean;
  message: string;
}

export interface UploadResumeApiResponse {
  success?: boolean;
  message?: string;
}

export interface ResumeSectionPayload {
  key: string;
  title: string;
  content: string | string[];
  order: number;
}

function getResumeAuthHeaders(includeJsonContentType = false): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(AUTH_TOKEN_KEY)
      : null;

  if (!token) {
    throw new Error("You must be signed in to manage your resume.");
  }

  return {
    Authorization: `Bearer ${token}`,
    ...(includeJsonContentType ? { "Content-Type": "application/json" } : {}),
  };
}

async function getApiError(res: Response): Promise<Error> {
  const text = await res.text();
  if (text) {
    try {
      const body = JSON.parse(text) as { message?: string };
      if (body.message) return new Error(body.message);
    } catch {
      return new Error(`API Error: ${res.status} ${res.statusText} - ${text}`);
    }
  }

  return new Error(`API Error: ${res.status} ${res.statusText}`);
}

async function readResumeMutationResponse(
  res: Response
): Promise<UploadResumeApiResponse> {
  const text = await res.text();
  if (!text) return {};

  if ((res.headers.get("content-type") ?? "").includes("application/json")) {
    try {
      return JSON.parse(text) as UploadResumeApiResponse;
    } catch {
      throw new Error("The resume API returned invalid JSON.");
    }
  }

  return { message: text };
}

/** GET /resume — retrieve saved resume metadata and sections */
export async function getResume(): Promise<unknown | null> {
  const res = await fetch(`${USER_BASE_URL}/resume`, {
    headers: getResumeAuthHeaders(),
  });

  if (res.status === 404) return null;
  if (res.status === 204) return null;
  if (!res.ok) throw await getApiError(res);

  return handleResponse<unknown>(res);
}

export interface DownloadedResume {
  blob: Blob;
  fileName: string | null;
}

/** GET /resume/file — retrieve the uploaded resume file */
export async function getResumeFile(): Promise<DownloadedResume> {
  const res = await fetch(`${USER_BASE_URL}/resume/file`, {
    headers: getResumeAuthHeaders(),
  });

  if (!res.ok) throw await getApiError(res);

  const disposition = res.headers.get("content-disposition");
  const encodedName = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const quotedName = disposition?.match(/filename="?([^";]+)"?/i)?.[1];

  return {
    blob: await res.blob(),
    fileName: encodedName
      ? decodeURIComponent(encodedName)
      : quotedName ?? null,
  };
}

/** PATCH /resume — replace the saved resume sections */
export async function updateResumeSections(
  sections: ResumeSectionPayload[]
): Promise<UploadResumeApiResponse> {
  const res = await fetch(`${USER_BASE_URL}/resume`, {
    method: "PATCH",
    headers: getResumeAuthHeaders(true),
    body: JSON.stringify({ sections }),
  });

  if (!res.ok) throw await getApiError(res);

  return readResumeMutationResponse(res);
}

/** DELETE /resume — remove the saved resume and its file */
export async function deleteResume(): Promise<UploadResumeApiResponse> {
  const res = await fetch(`${USER_BASE_URL}/resume`, {
    method: "DELETE",
    headers: getResumeAuthHeaders(),
  });

  if (!res.ok) throw await getApiError(res);

  return readResumeMutationResponse(res);
}

/** POST /resume — multipart form with the resume file and extracted sections */
export async function uploadResume(
  formData: FormData
): Promise<UploadResumeApiResponse> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(AUTH_TOKEN_KEY)
      : null;

  if (!token) {
    throw new Error("You must be signed in to upload a resume.");
  }

  const res = await fetch(`${USER_BASE_URL}/resume`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<UploadResumeApiResponse>(res);
}

/** POST /apply — multipart form with resume file + application fields */
export async function applyForJob(formData: FormData): Promise<ApplyJobApiResponse> {
  const headers: Record<string, string> = {};

  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${JOB_BASE_URL}/apply`, {
    method: "POST",
    headers,
    body: formData,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const text = await res.text();

  if (!res.ok) {
    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(text) as { message?: string };
        throw new Error(json.message || `Request failed (${res.status})`);
      } catch (error) {
        if (error instanceof Error && error.message && !error.message.includes("JSON")) {
          throw error;
        }
      }
    }
    throw new Error(`API Error: ${res.status} ${res.statusText} - ${text}`);
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(text) as ApplyJobApiResponse;
  }

  throw new Error(`Expected JSON response but received: ${text.slice(0, 120)}`);
}
