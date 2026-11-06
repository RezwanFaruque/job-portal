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
        className="icon"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ color: isSaved ? "#d1525c" : "#277f6a" }}
      >
        <path
          d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
          fill={isSaved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
