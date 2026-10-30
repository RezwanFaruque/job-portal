import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { applyForJob, jobApi, jobAuthApi, ApplyJobApiResponse } from "@/services/api";

export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  jobType: string;
  image?: string;
  postedBy?: JobPostedBy | null;
}

export interface JobCategory {
  _id: string;
  name: string;
}

export interface JobCompany {
  name: string;
  location: string;
  website: string;
  description: string;
  industry: string;
}

export interface JobPostedBy {
  _id: string;
  userId: string;
  email: string;
  userName: string;
  userType: string;
  company?: JobCompany | null;
}

export interface JobDetails extends Job {
  vacancy: number;
  category?: JobCategory | null;
  postedBy?: JobPostedBy | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  vacancy: number;
  category: string;
  location: string;
  salaryRange: string;
  jobType: string;
  postedBy: string;
}

export interface JobApplicationProfile {
  _id?: string;
  userId?: string;
  userName?: string;
  email?: string;
  userType?: string;
}

export interface JobApplicationApplicant {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  coverLetter: string;
  resume: string;
  resumeUrl: string;
  profile?: JobApplicationProfile | null;
}

export interface JobApplicationEmployer {
  _id: string;
  userId?: string;
  userName?: string;
  email?: string;
  company?: JobCompany | null;
}

export interface JobApplicationJob extends Job {
  vacancy?: number;
  category?: JobCategory | null;
  applicationDeadline?: string;
  createdAt?: string;
}

export interface JobApplication {
  _id: string;
  appliedAt: string;
  updatedAt: string;
  applicant: JobApplicationApplicant;
  job: JobApplicationJob | null;
  employer: JobApplicationEmployer | null;
}

interface MyApplicationsApiResponse {
  status: string;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    applications: JobApplication[];
  };
}

interface JobListApiResponse {
  message: string;
  data: {
    total: number;
    jobs: Job[];
    page: number;
    limit: number;
  };
}

interface JobDetailsApiResponse {
  status: string;
  message: string;
  data: JobDetails;
}

interface CreateJobApiResponse {
  status: string;
  message: string;
  data?: JobDetails;
}

export interface JobSearchFilters {
  keyword: string;
  category: string;
  location: string;
  jobTypes: string[];
  seniorityLevels: string[];
  salaryRanges: string[];
}

const SEARCH_QUERY_KEYS = [
  "keyword",
  "category",
  "location",
  "jobType",
  "seniorityLevel",
  "salaryRange",
  "page",
  "limit",
] as const;

function updateJobSearchUrl(filters: JobSearchFilters, page: number) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  SEARCH_QUERY_KEYS.forEach((key) => url.searchParams.delete(key));

  if (filters.keyword.trim()) url.searchParams.set("keyword", filters.keyword.trim());
  if (filters.category) url.searchParams.set("category", filters.category);
  if (filters.location.trim()) url.searchParams.set("location", filters.location.trim());
  if (filters.jobTypes.length) url.searchParams.set("jobType", filters.jobTypes.join(","));
  if (filters.seniorityLevels.length) {
    url.searchParams.set("seniorityLevel", filters.seniorityLevels.join(","));
  }
  if (filters.salaryRanges.length) {
    url.searchParams.set("salaryRange", filters.salaryRanges.join(","));
  }
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", "10");

  window.history.replaceState(window.history.state, "", url);
}

function readJobSearchUrl(): {
  filters: JobSearchFilters;
  page: number;
} {
  const params = new URLSearchParams(window.location.search);
  const page = Number.parseInt(params.get("page") ?? "1", 10);

  return {
    filters: {
      keyword: params.get("keyword") ?? "",
      category: params.get("category") ?? "",
      location: params.get("location") ?? "",
      jobTypes: (params.get("jobType") ?? "").split(",").filter(Boolean),
      seniorityLevels: (params.get("seniorityLevel") ?? "").split(",").filter(Boolean),
      salaryRanges: (params.get("salaryRange") ?? "").split(",").filter(Boolean),
    },
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

const EMPTY_JOB_SEARCH_FILTERS: JobSearchFilters = {
  keyword: "",
  category: "",
  location: "",
  jobTypes: [],
  seniorityLevels: [],
  salaryRanges: [],
};

export interface JobState {
  jobs: Job[];
  jobsTotal: number;
  jobsPage: number;
  jobsLimit: number;
  jobsError: string | null;
  searchFilters: JobSearchFilters;
  searchInitialized: boolean;
  searchFormVersion: number;
  isLoadingJobs: boolean;
  jobDetails: JobDetails | null;
  isLoadingDetails: boolean;
  isCreating: boolean;
  isApplying: boolean;
  applications: JobApplication[];
  applicationsTotal: number;
  applicationsPage: number;
  applicationsLimit: number;
  isLoadingApplications: boolean;
  selectedApplication: JobApplication | null;
  isLoadingApplicationDetails: boolean;
  setJobs: (jobs: Job[]) => void;
  setSearchFilters: (filters: Partial<JobSearchFilters>) => void;
  resetSearchForm: () => void;
  toggleSearchFilter: (
    key: "jobTypes" | "seniorityLevels" | "salaryRanges",
    value: string
  ) => void;
  setSearchPage: (page: number) => void;
  hydrateSearchFromUrl: () => void;
  fetchJobs: (page?: number, limit?: number) => Promise<void>;
  fetchJobDetails: (jobId: string) => Promise<JobDetailsApiResponse>;
  createJob: (payload: CreateJobPayload) => Promise<CreateJobApiResponse>;
  applyJob: (formData: FormData) => Promise<ApplyJobApiResponse>;
  fetchMyApplications: (page?: number, limit?: number) => Promise<MyApplicationsApiResponse>;
  fetchApplicationDetails: (applicationId: string) => Promise<JobApplication | null>;
  resolveEmployerId: (jobId: string, employerId?: string) => Promise<string>;
  clearJobDetails: () => void;
  clearSelectedApplication: () => void;
}

export const useJobStore = create<JobState>()(
  devtools((set, get) => ({
    jobs: [],
    jobsTotal: 0,
    jobsPage: 1,
    jobsLimit: 10,
    jobsError: null,
    searchFilters: EMPTY_JOB_SEARCH_FILTERS,
    searchInitialized: false,
    searchFormVersion: 0,
    isLoadingJobs: false,
    jobDetails: null,
    isLoadingDetails: false,
    isCreating: false,
    isApplying: false,
    applications: [],
    applicationsTotal: 0,
    applicationsPage: 1,
    applicationsLimit: 10,
    isLoadingApplications: false,
    selectedApplication: null,
    isLoadingApplicationDetails: false,

    setJobs: (jobs) => set({ jobs }),

    setSearchFilters: (filters) =>
      {
        const searchFilters = { ...get().searchFilters, ...filters };
        set({ searchFilters, jobsPage: 1 });
        updateJobSearchUrl(searchFilters, 1);
      },

    resetSearchForm: () =>
      set((state) => ({ searchFormVersion: state.searchFormVersion + 1 })),

    toggleSearchFilter: (key, value) => {
      const current = get().searchFilters;
      const selected = current[key];
      const nextValues = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      const searchFilters = { ...current, [key]: nextValues };

      set({ searchFilters, jobsPage: 1 });
      updateJobSearchUrl(searchFilters, 1);
    },

    setSearchPage: (page) => {
      set({ jobsPage: page });
      updateJobSearchUrl(get().searchFilters, page);
    },

    hydrateSearchFromUrl: () => {
      if (typeof window === "undefined") return;
      const { filters, page } = readJobSearchUrl();
      set((state) => ({
        searchFilters: filters,
        jobsPage: page,
        searchInitialized: true,
        searchFormVersion: state.searchFormVersion + 1,
      }));
    },

    clearJobDetails: () => set({ jobDetails: null }),

    clearSelectedApplication: () => set({ selectedApplication: null }),

    fetchJobs: async (page = 1, limit = 10) => {
      set({ isLoadingJobs: true, jobsError: null });
      try {
        const { searchFilters } = get();
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (searchFilters.keyword.trim()) {
          params.set("keyword", searchFilters.keyword.trim());
        }
        if (searchFilters.category) params.set("category", searchFilters.category);
        if (searchFilters.location.trim()) {
          params.set("location", searchFilters.location.trim());
        }
        if (searchFilters.jobTypes.length) {
          params.set("jobType", searchFilters.jobTypes.join(","));
        }
        if (searchFilters.seniorityLevels.length) {
          params.set("seniorityLevel", searchFilters.seniorityLevels.join(","));
        }
        if (searchFilters.salaryRanges.length) {
          params.set("salaryRange", searchFilters.salaryRanges.join(","));
        }

        const response = await jobApi.get<JobListApiResponse>(
          `/get-jobs?${params.toString()}`
        );
        set({
          jobs: response.data.jobs ?? [],
          jobsTotal: response.data.total ?? 0,
          jobsPage: response.data.page ?? page,
          jobsLimit: response.data.limit ?? limit,
        });
      } catch (error) {
        console.error("Failed to load jobs", error);
        set({
          jobs: [],
          jobsTotal: 0,
          jobsPage: page,
          jobsLimit: limit,
          jobsError:
            error instanceof Error ? error.message : "Failed to load jobs.",
        });
      } finally {
        set({ isLoadingJobs: false });
      }
    },

    fetchJobDetails: async (jobId: string) => {
      set({ isLoadingDetails: true, jobDetails: null });
      try {
        const response = await jobApi.get<JobDetailsApiResponse>(
          `/get-job-details/${jobId}`
        );
        set({ jobDetails: response.data });
        return response;
      } finally {
        set({ isLoadingDetails: false });
      }
    },

    createJob: async (payload: CreateJobPayload) => {
      set({ isCreating: true });
      try {
        const response = await jobAuthApi.post<CreateJobApiResponse, CreateJobPayload>(
          "/create",
          payload
        );
        return response;
      } finally {
        set({ isCreating: false });
      }
    },

    resolveEmployerId: async (jobId: string, employerId?: string) => {
      if (employerId) return employerId;

      const response = await jobApi.get<JobDetailsApiResponse>(
        `/get-job-details/${jobId}`
      );
      const resolvedId = response.data.postedBy?._id;
      if (!resolvedId) {
        throw new Error("Employer information is not available for this job.");
      }
      return resolvedId;
    },

    applyJob: async (formData: FormData) => {
      set({ isApplying: true });
      try {
        return await applyForJob(formData);
      } finally {
        set({ isApplying: false });
      }
    },

    fetchMyApplications: async (page = 1, limit = 10) => {
      set({ isLoadingApplications: true });
      try {
        const response = await jobAuthApi.get<MyApplicationsApiResponse>(
          `/my-applications?page=${page}&limit=${limit}`
        );
        set({
          applications: response.data.applications ?? [],
          applicationsTotal: response.data.total ?? 0,
          applicationsPage: response.data.page ?? page,
          applicationsLimit: response.data.limit ?? limit,
        });
        return response;
      } catch (error) {
        console.error("Failed to load applications", error);
        set({
          applications: [],
          applicationsTotal: 0,
          applicationsPage: page,
          applicationsLimit: limit,
        });
        throw error;
      } finally {
        set({ isLoadingApplications: false });
      }
    },

    fetchApplicationDetails: async (applicationId: string) => {
      set({ isLoadingApplicationDetails: true, selectedApplication: null });
      try {
        const response = await jobAuthApi.get<MyApplicationsApiResponse>(
          `/my-applications?page=1&limit=100`
        );
        const applications = response.data.applications ?? [];
        const application =
          applications.find((item) => item._id === applicationId) ?? null;

        set({
          applications,
          applicationsTotal: response.data.total ?? applications.length,
          selectedApplication: application,
        });
        return application;
      } finally {
        set({ isLoadingApplicationDetails: false });
      }
    },
  }))
);
