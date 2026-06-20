"use client";

import React, { FormEvent, useState } from "react";
import { useStore, RootState } from "../../store/modalStore";
import { userStore } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";

const SingupModal: React.FC = () => {
  const toggleSignup = useStore((state: RootState) => state.toggleSignupModal);
  const toggleLogin = useStore((state: RootState) => state.toggleLoginModal);
  const showCompanySignup = useStore((state: RootState) => state.showCompanySignup);
  const setCompanySignup = useStore((state: RootState) => state.setCompanySignup);
  const { register } = userStore();

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleRegisterSuccess(message?: string) {
    const text = message || "Account created successfully! Please log in.";
    setSuccessMessage(text);
    setError(null);
    useToastStore.getState().showToast(text);

    window.setTimeout(() => {
      setSuccessMessage(null);
      toggleSignup?.();
      toggleLogin?.();
    }, 1500);
  }

  async function submitUserSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const firstName = (formData.get("firstName") as string).trim();
    const lastName = (formData.get("lastName") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const userType = formData.get("userType") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register({
        userName: `${firstName} ${lastName}`.trim(),
        email,
        password,
        userType,
      });
      handleRegisterSuccess(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitCompanySignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const companyName = (formData.get("companyName") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const userType = formData.get("userType") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register({
        userName: companyName,
        email,
        password,
        userType,
      });
      handleRegisterSuccess(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="signup-modal-placeholder">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title" id="SignUpModalLabel">
              Sign Up
            </div>
            <button
              type="button"
              className="modal-close"
              aria-label="Close signup modal"
              onClick={() => toggleSignup?.()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 2L14 14M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="signup-form-with-tab">
            <div className="signup-tabs">
              <button
                type="button"
                className={`signup-tab${!showCompanySignup ? " active" : ""}`}
                onClick={() => {
                  setError(null);
                  setCompanySignup?.(false);
                }}
              >
                User
              </button>
              <button
                type="button"
                className={`signup-tab${showCompanySignup ? " active" : ""}`}
                onClick={() => {
                  setError(null);
                  setCompanySignup?.(true);
                }}
              >
                Company
              </button>
            </div>
            {successMessage && <div className="signup-success">{successMessage}</div>}
            {error && <div className="signup-error">{error}</div>}
            <div className="tab-section">
              {!showCompanySignup && (
              <div className="job-seeker-form">
                <form onSubmit={submitUserSignup}>
                  <div className="form-row first-row">
                    <input
                      className="first-name"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      required
                    />
                    <input
                      className="last-name"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <select name="userType" defaultValue="job_seeker" required>
                      <option value="job_seeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <input
                      className="email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      className="password"
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      className="password"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                  <div className="submit-button">
                    <button type="submit" className="signup" disabled={isSubmitting}>
                      {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>
                  </div>
                </form>
              </div>
              )}

              {showCompanySignup && (
              <div className="company-form">
                <form onSubmit={submitCompanySignup}>
                  <div className="form-row">
                    <input
                      className="company-name"
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <select name="userType" defaultValue="employer" required>
                      <option value="job_seeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <input
                      className="company-eamil"
                      type="email"
                      name="email"
                      placeholder="Company Email"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      className="company-password"
                      type="password"
                      name="password"
                      placeholder="Company Password"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      className="password"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                  <div className="company-form-submit">
                    <button type="submit" className="button-submit" disabled={isSubmitting}>
                      {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>
                  </div>
                </form>
              </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <div className="footer-signup-modal">
              <div className="text">Already have an account?</div>
              <div className="signinlink">
                <button
                  className="open-login-button"
                  onClick={() => {
                    if (toggleSignup) toggleSignup();
                    if (toggleLogin) toggleLogin();
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingupModal;
