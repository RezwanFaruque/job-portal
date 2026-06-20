import { create } from "zustand";
import { devtools } from "zustand/middleware";

// global state interface - extend with your app's state
export interface RootState {
  showLoginModal?: boolean;
  showSignupModal?: boolean;
  showCompanySignup?: boolean;
  toggleLoginModal?: () => void;
  toggleSignupModal?: () => void;
  toggleCompanySignup?: () => void;
  setCompanySignup?: (isCompany: boolean) => void;
}

// basic store with working toggles
export const useStore = create<RootState>()(
  devtools(
    (set) => ({
      // default state placeholders
      showLoginModal: false,
      showSignupModal: false,
      showCompanySignup: false,

      // toggle functions flip the corresponding flag
      toggleLoginModal: () => set((state) => ({ showLoginModal: !state.showLoginModal })),
      toggleSignupModal: () => set((state) => ({ showSignupModal: !state.showSignupModal })),

      toggleCompanySignup: () =>
        set((state) => ({ showCompanySignup: !state.showCompanySignup })),

      setCompanySignup: (isCompany: boolean) => set({ showCompanySignup: isCompany }),
    })
  )
);
