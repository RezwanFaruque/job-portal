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

interface JobApiResponse {
  message: string;
  data: {
    total: number;
    jobs: Job[];
    page: number;
    limit: number;
  };
}

export interface JobState {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  fetchJobs: () => Promise<void>;
}

export const useJobStore = create<JobState>()(
  devtools((set) => ({
    jobs: [],

    setJobs: (jobs) => set({ jobs }),

    fetchJobs: async () => {
      try {
        const response = await jobApi.get<JobApiResponse>("/get-jobs");

        set({
          jobs: response.data.jobs,
        });

      } catch (error) {
        console.error("Failed to load jobs", error);
      }
    },
  }))
);