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

export interface JobState {
  jobs: Job[];
  jobsTotal: number;
  jobsPage: number;
  jobsLimit: number;
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
  devtools((set) => ({
    jobs: [],
    jobsTotal: 0,
    jobsPage: 1,
    jobsLimit: 9,
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

    clearJobDetails: () => set({ jobDetails: null }),

    clearSelectedApplication: () => set({ selectedApplication: null }),

    fetchJobs: async (page = 1, limit = 9) => {
      set({ isLoadingJobs: true });
      try {
        const response = await jobApi.get<JobListApiResponse>(
          `/get-jobs?page=${page}&limit=${limit}`
        );
        set({
          jobs: response.data.jobs ?? [],
          jobsTotal: response.data.total ?? 0,
          jobsPage: response.data.page ?? page,
          jobsLimit: response.data.limit ?? limit,
        });
      } catch (error) {
        console.error("Failed to load jobs", error);
        set({ jobs: [], jobsTotal: 0, jobsPage: page, jobsLimit: limit });
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
