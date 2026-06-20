import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ToastType = "success" | "error";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastState {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const TOAST_DURATION_MS = 4000;

export const useToastStore = create<ToastState>()(
  devtools((set, get) => ({
    toasts: [],

    showToast: (message, type = "success") => {
      const id = crypto.randomUUID();
      set((state) => ({
        toasts: [...state.toasts, { id, message, type }],
      }));

      window.setTimeout(() => {
        get().removeToast(id);
      }, TOAST_DURATION_MS);
    },

    removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      })),
  }))
);
