import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { jobApi } from "@/services/api";

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CategoryState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  getCategories: () => Promise<void>;
}

interface CategoryAPIResponse {
  status: string;
  message: string;
  data: Category[];
}

export const useCategoryStore = create<CategoryState>()(
  devtools((set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),
    getCategories: async () => {
      try {
        const response = await jobApi.get<CategoryAPIResponse>(
          "/job-category/getAll"
        );
        set({ categories: response.data ?? [] });
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    },
  }))
);