"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useToastStore } from "@/store/toastStore";

export default function ToastContainer() {
  const [mounted, setMounted] = useState(false);
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            aria-label="Dismiss notification"
            onClick={() => removeToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
