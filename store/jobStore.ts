import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { jobApi } from "@/services/api";

export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  jobType: string;
  image?: string;
}

export interface JobCategory {
  _id: string;
  name: string;
}

export interface JobPostedBy {
  _id: string;
  userId: string;
  email: string;
  userName: string;
  userType: string;
}

export interface JobDetails extends Job {
  vacancy: number;
  category: JobCategory;
  postedBy: JobPostedBy;
  createdAt: string;
  updatedAt: string;
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

export interface JobState {
  jobs: Job[];
  jobDetails: JobDetails | null;
  isLoadingDetails: boolean;
  setJobs: (jobs: Job[]) => void;
  fetchJobs: () => Promise<void>;
  fetchJobDetails: (jobId: string) => Promise<JobDetailsApiResponse>;
  clearJobDetails: () => void;
}

export const useJobStore = create<JobState>()(
  devtools((set) => ({
    jobs: [],
    jobDetails: null,
    isLoadingDetails: false,

    setJobs: (jobs) => set({ jobs }),

    clearJobDetails: () => set({ jobDetails: null }),

    fetchJobs: async () => {
      try {
        const response = await jobApi.get<JobListApiResponse>("/get-jobs");
        set({ jobs: response.data.jobs });
      } catch (error) {
        console.error("Failed to load jobs", error);
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
  }))
);
