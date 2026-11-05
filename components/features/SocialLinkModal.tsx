"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { userStore } from "@/store/userStore";
import type { SocialLinkPlatform } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";

interface SocialLinkModalProps {
  platform: SocialLinkPlatform;
  label: string;
  value: string;
  onClose: () => void;
}

function normalizeUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(withProtocol);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Please enter a valid website address.");
  }

  return url.toString();
}

export default function SocialLinkModal({
  platform,
  label,
  value,
  onClose,
}: SocialLinkModalProps) {
  const setSocialLink = userStore((state) => state.setSocialLink);
  const [url, setUrl] = useState(value.replace(/^https?:\/\//i, ""));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const normalizedUrl = normalizeUrl(url.trim());
      setSocialLink(platform, normalizedUrl);
      useToastStore.getState().showToast(`${label} link saved.`);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Please enter a valid website address."
      );
    }
  }

  function handleRemove() {
    setSocialLink(platform, "");
    useToastStore.getState().showToast(`${label} link removed.`);
    onClose();
  }

  return (
    <div
      className="social-link-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="social-link-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="social-link-modal-title"
      >
        <button
          className="social-link-modal-close"
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          ×
        </button>
        <div className="social-link-modal-heading">
          <span className={`social-link-modal-icon social-link-modal-icon-${platform}`}>
            {label.slice(0, 1)}
          </span>
          <div>
            <p className="social-link-modal-eyebrow">Profile social link</p>
            <h2 id="social-link-modal-title">
              {value ? `Edit ${label} link` : `Add ${label} link`}
            </h2>
          </div>
        </div>
        <p className="social-link-modal-description">
          Add a public link so people can find you online.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="social-link-url">{label} URL</label>
          <div className="social-link-input-wrap">
            <span aria-hidden="true">https://</span>
            <input
              ref={inputRef}
              id="social-link-url"
              type="text"
              inputMode="url"
              placeholder="example.com/your-profile"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value.replace(/^https?:\/\//i, ""))
              }
              required
            />
          </div>
          {error && (
            <p className="social-link-modal-error" role="alert">
              {error}
            </p>
          )}
          <div className="social-link-modal-actions">
            {value && (
              <button
                className="social-link-remove"
                type="button"
                onClick={handleRemove}
              >
                Remove link
              </button>
            )}
            <div className="social-link-modal-actions-right">
              <button
                className="social-link-cancel"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="social-link-save" type="submit">
                Save link
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
