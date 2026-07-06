"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useJobStore } from "@/store/jobStore";
import { useCategoryStore } from "@/store/categoryStore";
import { getPostedById, userStore } from "@/store/userStore";
import { useToastStore } from "@/store/toastStore";
import { useStore, RootState } from "@/store/modalStore";
import JobDescriptionEditor, { getEditorPlainText } from "@/components/features/JobDescriptionEditor";

const JOB_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
] as const;

const initialForm = {
  title: "",
  description: "",
  vacancy: "",
  category: "",
  location: "",
  salaryRange: "",
  jobType: "full-time",
};

export default function PostJobForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const user = userStore((state) => state.user);
  const hydrateAuth = userStore((state) => state.hydrateAuth);
  const fetchUserDetails = userStore((state) => state.fetchUserDetails);
  const categories = useCategoryStore((state) => state.categories);
  const getCategories = useCategoryStore((state) => state.getCategories);
  const createJob = useJobStore((state) => state.createJob);
  const isCreating = useJobStore((state) => state.isCreating);
  const toggleLoginModal = useStore((state: RootState) => state.toggleLoginModal);

  useEffect(() => {
    hydrateAuth();
    setAuthReady(true);
    getCategories();
  }, [hydrateAuth, getCategories]);

  useEffect(() => {
    if (!authReady || !user) return;
    fetchUserDetails().catch(() => {
      // Profile fetch is best-effort; posting still uses stored user id.
    });
  }, [authReady, user, fetchUserDetails]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Please sign in to post a job.");
      return;
    }

    let postedById = getPostedById(user);
    if (!postedById) {
      setError("Please sign in to post a job.");
      return;
    }

    try {
      await fetchUserDetails();
      postedById = getPostedById(userStore.getState().user) || postedById;
    } catch {
      // Continue with the id we already have.
    }

    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!getEditorPlainText(form.description)) {
      setError("Job description is required.");
      return;
    }

    if (!form.category) {
      setError("Please select a job category.");
      return;
    }

    if (!form.location.trim()) {
      setError("Location is required.");
      return;
    }

    if (!form.salaryRange.trim()) {
      setError("Salary range is required.");
      return;
    }

    const vacancy = Number(form.vacancy);
    if (!form.vacancy || Number.isNaN(vacancy) || vacancy < 1) {
      setError("Vacancy must be at least 1.");
      return;
    }

    try {
      const response = await createJob({
        title: form.title.trim(),
        description: form.description.trim(),
        vacancy,
        category: form.category,
        location: form.location.trim(),
        salaryRange: form.salaryRange.trim(),
        jobType: form.jobType,
        postedBy: postedById,
      });

      useToastStore.getState().showToast(response.message || "Job posted successfully!");
      setForm(initialForm);
      router.push("/browse-job");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Failed to post job."
      );
    }
  }

  if (!authReady) {
    return (
      <div id="primary-job-information" className="layout-body">
        <div className="container">
          <div className="post-job-card">
            <div className="post-job-loading">Loading form...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div id="primary-job-information" className="layout-body">
        <div className="container">
          <div className="post-job-card">
            <div className="card-header">
              <div className="title">Post a Job</div>
              <p className="subtitle">Reach thousands of qualified candidates</p>
            </div>
            <hr />
            <div className="post-job-auth-message">
              <div className="auth-icon">🔒</div>
              <p>You need to sign in before posting a job.</p>
              <button
                type="button"
                className="button-submit"
                onClick={() => toggleLoginModal?.()}
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="primary-job-information" className="layout-body">
      <div className="container">
        <div className="post-job-card">
          <div className="card-header">
            <div className="title">Post a Job</div>
            <p className="subtitle">
              Fill in the details below to publish your job listing.
            </p>
          </div>
          <hr />

          <div className="form-section">
            <form onSubmit={handleSubmit}>
              {error && <div className="post-job-error">{error}</div>}

              <div className="form-block">
                <div className="block-title">Basic Information</div>

                <div className="input-section">
                  <label htmlFor="job-title">Job Title</label>
                  <input
                    id="job-title"
                    type="text"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>

                <div className="input-section">
                  <label htmlFor="job-description">Job Description</label>
                  <JobDescriptionEditor
                    id="job-description"
                    value={form.description}
                    onChange={(value) => updateField("description", value)}
                    placeholder="Describe responsibilities, requirements, and benefits..."
                  />
                </div>

                <div className="input-section">
                  <label htmlFor="job-category">Category</label>
                  <select
                    id="job-category"
                    value={form.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-block">
                <div className="block-title">Job Details</div>

                <div className="input-row">
                  <div className="input-section">
                    <label htmlFor="job-location">Location</label>
                    <input
                      id="job-location"
                      type="text"
                      value={form.location}
                      onChange={(event) => updateField("location", event.target.value)}
                      placeholder="e.g. Dhaka"
                      required
                    />
                  </div>

                  <div className="input-section">
                    <label htmlFor="job-vacancy">Vacancy</label>
                    <input
                      id="job-vacancy"
                      type="number"
                      min={1}
                      value={form.vacancy}
                      onChange={(event) => updateField("vacancy", event.target.value)}
                      placeholder="e.g. 4"
                      required
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-section">
                    <label htmlFor="job-salary">Salary Range</label>
                    <input
                      id="job-salary"
                      type="text"
                      value={form.salaryRange}
                      onChange={(event) => updateField("salaryRange", event.target.value)}
                      placeholder="e.g. 30k-40k"
                      required
                    />
                  </div>

                  <div className="input-section">
                    <label htmlFor="job-type">Job Type</label>
                    <select
                      id="job-type"
                      value={form.jobType}
                      onChange={(event) => updateField("jobType", event.target.value)}
                      required
                    >
                      {JOB_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-block">
                <div className="block-title">Posting Information</div>

                <div className="input-section">
                  <label>Posted By</label>
                  <div className="posted-by-card">
                    <div className="posted-by-name">{user.userName}</div>
                    <div className="posted-by-email">{user.email}</div>
                  </div>
                </div>
              </div>

              <div className="post-job-footer">
                A clear and detailed job post helps you attract the right candidates faster.
              </div>

              <div className="submit-section">
                <Link href="/browse-job" className="button-cancel">
                  Cancel
                </Link>
                <button type="submit" className="button-submit" disabled={isCreating}>
                  {isCreating ? "Posting..." : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
