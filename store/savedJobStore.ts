import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { jobAuthApi } from "@/services/api";
import type { Job, JobCompany, JobPostedBy } from "@/store/jobStore";

type SavedJobsData = {
  jobs?: unknown[];
  savedJobs?: unknown[];
  total?: number;
  page?: number;
  limit?: number;
};

interface SavedJobsResponse {
  data: unknown[] | SavedJobsData;
}

interface SavedJobState {
  savedJobs: Job[];
  savedJobIds: string[];
  savedJobsTotal: number;
  savedJobsPage: number;
  savedJobsLimit: number;
  isLoadingSavedJobs: boolean;
  savedJobsError: string | null;
  pendingSavedJobIds: string[];
  fetchSavedJobs: (page?: number, limit?: number) => Promise<void>;
  saveJob: (jobId: string) => Promise<void>;
  removeSavedJob: (jobId: string) => Promise<void>;
  clearSavedJobs: () => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readPostedBy(value: unknown): JobPostedBy | null | undefined {
  if (value === null) return null;
  if (
    !isRecord(value) ||
    typeof value._id !== "string" ||
    typeof value.userId !== "string" ||
    typeof value.email !== "string" ||
    typeof value.userName !== "string" ||
    typeof value.userType !== "string"
  ) {
    return undefined;
  }

  const rawCompany = value.company;
  let company: JobCompany | null | undefined;
  if (rawCompany === null) {
    company = null;
  } else if (
    isRecord(rawCompany) &&
    typeof rawCompany.name === "string" &&
    typeof rawCompany.location === "string" &&
    typeof rawCompany.website === "string" &&
    typeof rawCompany.description === "string" &&
    typeof rawCompany.industry === "string"
  ) {
    company = {
      name: rawCompany.name,
      location: rawCompany.location,
      website: rawCompany.website,
      description: rawCompany.description,
      industry: rawCompany.industry,
    };
  }

  return {
    _id: value._id,
    userId: value.userId,
    email: value.email,
    userName: value.userName,
    userType: value.userType,
    ...(company !== undefined ? { company } : {}),
  };
}

function unwrapSavedJob(value: unknown): Job {
  if (!isRecord(value)) {
    throw new Error("The saved jobs API returned an invalid job.");
  }

  const nestedJob = value.job ?? value.jobId;
  const job = isRecord(nestedJob) ? nestedJob : value;
  if (
    typeof job._id !== "string" ||
    typeof job.title !== "string" ||
    typeof job.description !== "string" ||
    typeof job.location !== "string" ||
    typeof job.salaryRange !== "string" ||
    typeof job.jobType !== "string"
  ) {
    throw new Error("The saved jobs API returned an incomplete job.");
  }

  const postedBy = readPostedBy(job.postedBy);

  return {
    _id: job._id,
    title: job.title,
    description: job.description,
    location: job.location,
    salaryRange: job.salaryRange,
    jobType: job.jobType,
    ...(typeof job.image === "string" ? { image: job.image } : {}),
    ...(postedBy !== undefined ? { postedBy } : {}),
  };
}

function readSavedJobsResponse(
  response: SavedJobsResponse,
  page: number,
  limit: number
) {
  const data = response.data;
  const records = Array.isArray(data) ? data : data.savedJobs ?? data.jobs;

  if (!records) {
    throw new Error("The saved jobs API response did not include a jobs list.");
  }

  const total = Array.isArray(data) ? records.length : data.total ?? records.length;
  const responsePage = Array.isArray(data) ? page : data.page ?? page;
  const responseLimit = Array.isArray(data) ? limit : data.limit ?? limit;
  if (
    !Number.isInteger(total) ||
    !Number.isInteger(responsePage) ||
    !Number.isInteger(responseLimit)
  ) {
    throw new Error("The saved jobs API returned invalid pagination details.");
  }

  return {
    jobs: records.map(unwrapSavedJob),
    total,
    page: responsePage,
    limit: responseLimit,
  };
}

function setPendingJob(jobId: string, pending: boolean) {
  return (ids: string[]) =>
    pending
      ? ids.includes(jobId)
        ? ids
        : [...ids, jobId]
      : ids.filter((id) => id !== jobId);
}

let latestSavedJobsRequest = 0;
let savedJobsIdentity = 0;

export const useSavedJobStore = create<SavedJobState>()(
  devtools((set) => ({
    savedJobs: [],
    savedJobIds: [],
    savedJobsTotal: 0,
    savedJobsPage: 1,
    savedJobsLimit: 10,
    isLoadingSavedJobs: false,
    savedJobsError: null,
    pendingSavedJobIds: [],

    fetchSavedJobs: async (page = 1, limit = 10) => {
      const requestId = ++latestSavedJobsRequest;
      set({ isLoadingSavedJobs: true, savedJobsError: null });
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        const response = await jobAuthApi.get<SavedJobsResponse>(
          `/saved-jobs?${params.toString()}`
        );
        const result = readSavedJobsResponse(response, page, limit);
        if (requestId === latestSavedJobsRequest) {
          set((state) => ({
            savedJobs: result.jobs,
            savedJobIds: Array.from(
              new Set([...state.savedJobIds, ...result.jobs.map((job) => job._id)])
            ),
            savedJobsTotal: result.total,
            savedJobsPage: result.page,
            savedJobsLimit: result.limit,
          }));
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load saved jobs.";
        if (requestId === latestSavedJobsRequest) {
          set({ savedJobsError: message });
        }
        throw error;
      } finally {
        if (requestId === latestSavedJobsRequest) {
          set({ isLoadingSavedJobs: false });
        }
      }
    },

    saveJob: async (jobId) => {
      const identity = savedJobsIdentity;
      set((state) => ({
        pendingSavedJobIds: setPendingJob(jobId, true)(state.pendingSavedJobIds),
      }));
      try {
        await jobAuthApi.post<unknown>(`/saved-jobs/${encodeURIComponent(jobId)}`);
        if (identity === savedJobsIdentity) {
          set((state) => ({
            savedJobIds: state.savedJobIds.includes(jobId)
              ? state.savedJobIds
              : [...state.savedJobIds, jobId],
          }));
        }
      } finally {
        if (identity === savedJobsIdentity) {
          set((state) => ({
            pendingSavedJobIds: setPendingJob(jobId, false)(state.pendingSavedJobIds),
          }));
        }
      }
    },

    removeSavedJob: async (jobId) => {
      const identity = savedJobsIdentity;
      set((state) => ({
        pendingSavedJobIds: setPendingJob(jobId, true)(state.pendingSavedJobIds),
      }));
      try {
        await jobAuthApi.del<unknown>(`/saved-jobs/${encodeURIComponent(jobId)}`);
        if (identity === savedJobsIdentity) {
          set((state) => ({
            savedJobs: state.savedJobs.filter((job) => job._id !== jobId),
            savedJobIds: state.savedJobIds.filter((id) => id !== jobId),
            savedJobsTotal: Math.max(0, state.savedJobsTotal - 1),
          }));
        }
      } finally {
        if (identity === savedJobsIdentity) {
          set((state) => ({
            pendingSavedJobIds: setPendingJob(jobId, false)(state.pendingSavedJobIds),
          }));
        }
      }
    },

    clearSavedJobs: () => {
      savedJobsIdentity += 1;
      latestSavedJobsRequest += 1;
      set({
        savedJobs: [],
        savedJobIds: [],
        savedJobsTotal: 0,
        savedJobsPage: 1,
        savedJobsLimit: 10,
        isLoadingSavedJobs: false,
        savedJobsError: null,
        pendingSavedJobIds: [],
      });
    },
  }))
);
