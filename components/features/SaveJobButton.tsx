"use client";

import { useState } from "react";
import { useStore, RootState } from "@/store/modalStore";
import { useSavedJobStore } from "@/store/savedJobStore";
import { useToastStore } from "@/store/toastStore";

interface SaveJobButtonProps {
  jobId: string;
  className?: string;
}

export default function SaveJobButton({
  jobId,
  className = "love-jobs-button",
}: SaveJobButtonProps) {
  const isSaved = useSavedJobStore((state) => state.savedJobIds.includes(jobId));
  const isSubmitting = useSavedJobStore((state) =>
    state.pendingSavedJobIds.includes(jobId)
  );
  const [isSaveAnimating, setIsSaveAnimating] = useState(false);
  const saveJob = useSavedJobStore((state) => state.saveJob);
  const removeSavedJob = useSavedJobStore((state) => state.removeSavedJob);
  const toggleLoginModal = useStore((state: RootState) => state.toggleLoginModal);

  async function handleClick() {
    if (!localStorage.getItem("auth_token")) {
      toggleLoginModal?.();
      return;
    }

    try {
      if (isSaved) {
        await removeSavedJob(jobId);
        useToastStore.getState().showToast("Job removed from saved jobs.");
      } else {
        await saveJob(jobId);
        setIsSaveAnimating(false);
        requestAnimationFrame(() => setIsSaveAnimating(true));
        useToastStore.getState().showToast("Job saved successfully.");
      }
    } catch (error) {
      useToastStore
        .getState()
        .showToast(
          error instanceof Error ? error.message : "Unable to update saved jobs.",
          "error"
        );
    }
  }

  return (
    <button
      type="button"
      className={`${className}${isSaveAnimating ? " save-success-animation" : ""}`}
      aria-label={isSaved ? "Remove saved job" : "Save job"}
      aria-pressed={isSaved}
      disabled={isSubmitting}
      onClick={handleClick}
      onAnimationEnd={() => setIsSaveAnimating(false)}
    >
      <svg
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 21s-7.5-4.7-9.9-9.1C.2 8.3 2.2 5 5.5 5c1.7 0 3.3.8 4.5 2.1C11.2 5.8 12.8 5 14.5 5 17.8 5 19.8 8.3 21.9 11.9 19.5 16.3 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
