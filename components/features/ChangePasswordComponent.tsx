"use client";

import { FormEvent, useState } from "react";
import { userStore } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";

export default function ChangePasswordComponent() {
  const changePassword = userStore((state) => state.changePassword);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      setError("Please complete all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Your new password must be different from your current password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await changePassword({ currentPassword, newPassword });
      useToastStore
        .getState()
        .showToast(response?.message || "Password changed successfully.");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="change_password" aria-labelledby="change-password-title">
      <h1 className="title" id="change-password-title">
        Change Password
      </h1>
      <hr />
      <div className="change-password-card">
        <h2 className="title">Update your password</h2>
        <p className="change-password-description">
          Enter your current password and choose a new one for your account.
        </p>
        {error && (
          <div className="change-password-error" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label className="col-sm-4" htmlFor="current-password">
              Current Password
            </label>
            <div className="col-sm-8">
              <input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-4" htmlFor="new-password">
              New Password
            </label>
            <div className="col-sm-8">
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-4" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <div className="col-sm-8">
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4" />
            <div className="col-sm-8">
              <button
                className="submit-change-password"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
