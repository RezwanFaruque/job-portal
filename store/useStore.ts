import { create } from "zustand";

// global state interface - extend with your app's state
export interface RootState {
  showLoginModal?: boolean;
  showSignupModal?: boolean;
  toggleLoginModal?: () => void;
  toggleSignupModal?: () => void;
}

// basic store with working toggles
export const useStore = create<RootState>()((set) => ({
  // default state placeholders
  showLoginModal: false,
  showSignupModal: false,

  // toggle functions flip the corresponding flag
  toggleLoginModal: () =>
    set((state) => ({ showLoginModal: !state.showLoginModal })),
  toggleSignupModal: () =>
    set((state) => ({ showSignupModal: !state.showSignupModal })),
}));
