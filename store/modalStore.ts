import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ApplyJobTarget {
  id: string;
  title: string;
  location?: string;
  employerId?: string;
}

// global state interface - extend with your app's state
export interface RootState {
  showLoginModal?: boolean;
  showSignupModal?: boolean;
  showCompanySignup?: boolean;
  showApplyJobModal?: boolean;
  selectedApplyJob?: ApplyJobTarget | null;
  showAppliedJobDetailsModal?: boolean;
  selectedApplicationId?: string | null;
  toggleLoginModal?: () => void;
  toggleSignupModal?: () => void;
  toggleCompanySignup?: () => void;
  setCompanySignup?: (isCompany: boolean) => void;
  openApplyJobModal?: (job: ApplyJobTarget) => void;
  closeApplyJobModal?: () => void;
  openAppliedJobDetailsModal?: (applicationId: string) => void;
  closeAppliedJobDetailsModal?: () => void;
}

// basic store with working toggles
export const useStore = create<RootState>()(
  devtools(
    (set) => ({
      // default state placeholders
      showLoginModal: false,
      showSignupModal: false,
      showCompanySignup: false,
      showApplyJobModal: false,
      selectedApplyJob: null,
      showAppliedJobDetailsModal: false,
      selectedApplicationId: null,

      // toggle functions flip the corresponding flag
      toggleLoginModal: () => set((state) => ({ showLoginModal: !state.showLoginModal })),
      toggleSignupModal: () => set((state) => ({ showSignupModal: !state.showSignupModal })),

      toggleCompanySignup: () =>
        set((state) => ({ showCompanySignup: !state.showCompanySignup })),

      setCompanySignup: (isCompany: boolean) => set({ showCompanySignup: isCompany }),

      openApplyJobModal: (job) =>
        set({ showApplyJobModal: true, selectedApplyJob: job }),

      closeApplyJobModal: () =>
        set({ showApplyJobModal: false, selectedApplyJob: null }),

      openAppliedJobDetailsModal: (applicationId) =>
        set({
          showAppliedJobDetailsModal: true,
          selectedApplicationId: applicationId,
        }),

      closeAppliedJobDetailsModal: () =>
        set({
          showAppliedJobDetailsModal: false,
          selectedApplicationId: null,
        }),
    })
  )
);
