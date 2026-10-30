"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getResume, getResumeFile } from "@/services/api";

interface ResumeSection {
  key: string;
  title: string;
  content: string;
}

interface ResumeData {
  fileName: string;
  sections: ResumeSection[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeResume(value: unknown): ResumeData | null {
  if (!isRecord(value)) {
    if (value === null) return null;
    throw new Error("The resume response is invalid.");
  }

  let metadata = value;
  for (let depth = 0; depth < 3; depth += 1) {
    if (Array.isArray(metadata.sections)) break;
    if (metadata.data === null || metadata.resume === null) return null;
    if (isRecord(metadata.data)) {
      metadata = metadata.data;
    } else if (isRecord(metadata.resume)) {
      metadata = metadata.resume;
    } else {
      break;
    }
  }

  if (metadata.success === false) {
    throw new Error(
      typeof metadata.message === "string"
        ? metadata.message
        : "Failed to load your resume."
    );
  }
  if (!Array.isArray(metadata.sections)) {
    throw new Error("The resume response did not include a sections list.");
  }

  const sections = metadata.sections.map((rawSection, index) => {
    if (!isRecord(rawSection)) {
      throw new Error("The resume response contains an invalid section.");
    }

    const key =
      typeof rawSection.key === "string"
        ? rawSection.key
        : `section-${index + 1}`;
    const title =
      typeof rawSection.title === "string" && rawSection.title.trim()
        ? rawSection.title
        : key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    const content = Array.isArray(rawSection.content)
      ? rawSection.content.filter((item): item is string => typeof item === "string").join(", ")
      : typeof rawSection.content === "string"
        ? rawSection.content
        : "";

    return {
      section: { key, title, content },
      order: typeof rawSection.order === "number" ? rawSection.order : index,
    };
  });

  sections.sort((left, right) => left.order - right.order);
  const rawFileName =
    metadata.fileName ??
    metadata.filename ??
    metadata.originalName ??
    metadata.originalFilename ??
    metadata.name;

  return {
    fileName:
      typeof rawFileName === "string" && rawFileName.trim()
        ? rawFileName
        : "Uploaded resume",
    sections: sections.map(({ section }) => section),
  };
}

async function isPdf(blob: Blob, fileName: string | null) {
  if (
    blob.type.toLowerCase().includes("pdf") ||
    fileName?.toLowerCase().endsWith(".pdf") === true
  ) {
    return true;
  }

  return (await blob.slice(0, 5).text()).startsWith("%PDF-");
}

export default function ViewResumeComponent() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let previewUrl: string | null = null;

    async function loadResume() {
      try {
        const metadata = normalizeResume(await getResume());
        if (!active) return;
        setResume(metadata);
        if (!metadata) return;

        setIsLoadingFile(true);
        try {
          const downloaded = await getResumeFile();
          const fileName = downloaded.fileName || metadata.fileName;
          if (!(await isPdf(downloaded.blob, fileName))) return;

          const previewBlob =
            downloaded.blob.type === "application/pdf"
              ? downloaded.blob
              : new Blob([downloaded.blob], { type: "application/pdf" });
          previewUrl = URL.createObjectURL(previewBlob);
          if (active) {
            setPdfUrl(previewUrl);
          } else {
            URL.revokeObjectURL(previewUrl);
          }
        } catch (previewError) {
          if (active) {
            setFileError(
              previewError instanceof Error
                ? previewError.message
                : "Failed to load the resume file."
            );
          }
        } finally {
          if (active) setIsLoadingFile(false);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load your resume."
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadResume();
    return () => {
      active = false;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  async function handleDownload() {
    setIsDownloading(true);
    setFileError(null);
    try {
      const { blob, fileName } = await getResumeFile();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || resume?.fileName || "resume";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setFileError(
        downloadError instanceof Error
          ? downloadError.message
          : "Failed to download your resume."
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <section id="view_resume" aria-labelledby="view-resume-title">
      <div className="view-resume-card">
        <header className="view-resume-header">
          <div>
            <h1 id="view-resume-title">View Resume</h1>
            <p>Your uploaded resume and saved sections.</p>
          </div>
          {resume && (
            <button
              type="button"
              className="view-resume-download"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? "Preparing download..." : "Download Resume"}
            </button>
          )}
        </header>

        {isLoading ? (
          <div className="view-resume-state" role="status">Loading your resume...</div>
        ) : error ? (
          <div className="view-resume-state view-resume-error" role="alert">{error}</div>
        ) : !resume ? (
          <div className="view-resume-state">
            <p>You haven&apos;t uploaded a resume yet.</p>
            <Link href="/upload-resume">Upload a resume</Link>
          </div>
        ) : (
          <div className="view-resume-content">
            <div className="view-resume-file-name">{resume.fileName}</div>

            {fileError && (
              <div className="view-resume-error" role="alert">{fileError}</div>
            )}

            <div className="view-resume-preview">
              <h2>Resume file</h2>
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title={`Preview of ${resume.fileName}`}
                  className="view-resume-pdf"
                />
              ) : (
                <div className="view-resume-file-placeholder" role="status">
                  {isLoadingFile
                    ? "Loading your resume file..."
                    : "Preview is available for PDF files. Download your resume to view this file."}
                </div>
              )}
            </div>

            <div className="view-resume-sections">
              <h2>Resume sections</h2>
              {resume.sections.length === 0 ? (
                <p className="view-resume-no-sections">
                  No saved resume sections are available.
                </p>
              ) : (
                resume.sections.map((section) => (
                  <section className="view-resume-section" key={section.key}>
                    <h3>{section.title}</h3>
                    <p>{section.content || "No content provided."}</p>
                  </section>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
