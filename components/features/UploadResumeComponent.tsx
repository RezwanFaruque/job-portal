"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ResumeReviewView from "@/components/features/ResumeReviewView";
import {
  createPdfPreviewUrl,
  extractTextFromPdf,
  revokePdfPreviewUrl,
} from "@/lib/resumePdf";
import { parseResumeText, type ResumeField } from "@/lib/parseResumeText";
import {
  deleteResume,
  getResume,
  getResumeFile,
  updateResumeSections,
  uploadResume,
  type ResumeSectionPayload,
} from "@/services/api";
import { useToastStore } from "@/store/toastStore";

const MAX_FILE_SIZE = 500 * 1024;
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const NON_SECTION_FIELD_IDS = new Set([
  "email",
  "full-name",
  "linkedin",
  "phone",
  "website",
  "file-name",
  "note",
]);
const SECTION_KEYS: Record<string, string> = {
  "professional-summary": "summary",
  skills: "technicalSkills",
  "technical-skills": "technicalSkills",
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdfFile(file: File) {
  return file.name.toLowerCase().endsWith(".pdf");
}

async function isPdfBlob(blob: Blob, fileName: string | null): Promise<boolean> {
  if (blob.type.toLowerCase().includes("pdf") || fileName?.toLowerCase().endsWith(".pdf")) {
    return true;
  }

  return (await blob.slice(0, 5).text()).startsWith("%PDF-");
}

function toResumeSections(fields: ResumeField[]): ResumeSectionPayload[] {
  return fields
    .filter((field) => !NON_SECTION_FIELD_IDS.has(field.id) && field.value.trim())
    .map((field, order) => ({
      key:
        SECTION_KEYS[field.id] ??
        field.id.replace(/-([a-z0-9])/g, (_, character: string) =>
          character.toUpperCase()
        ),
      title: ["summary", "professional-summary"].includes(field.id)
        ? "Professional Summary"
        : ["skills", "technical-skills"].includes(field.id)
          ? "Technical Skills"
          : field.label,
      content:
        field.id === "skills" || field.id === "technical-skills"
          ? field.value
              .split(/[,\n]/)
              .map((skill) => skill.trim())
              .filter(Boolean)
          : field.value.trim(),
      order,
    }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeResumeMetadata(value: unknown): {
  fileName: string;
  fields: ResumeField[];
} | null {
  if (!isRecord(value)) return null;

  let metadata = value;
  for (let depth = 0; depth < 3; depth += 1) {
    if (Array.isArray(metadata.sections)) break;
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
        : "Failed to retrieve your saved resume."
    );
  }

  if (!Array.isArray(metadata.sections)) {
    if (metadata.data === null || metadata.resume === null) return null;
    throw new Error("The resume response did not include a sections list.");
  }

  const rawName =
    metadata.fileName ??
    metadata.filename ??
    metadata.originalName ??
    metadata.originalFilename ??
    metadata.name;
  const fileName =
    typeof rawName === "string" && rawName.trim()
      ? rawName
      : "Uploaded resume";

  const fields = metadata.sections.map((section, index) => {
    if (!isRecord(section)) {
      throw new Error("The resume response contains an invalid section.");
    }

    const key =
      typeof section.key === "string"
        ? section.key
        : typeof section.title === "string"
          ? section.title
          : `section-${index + 1}`;
    const title =
      typeof section.title === "string" && section.title.trim()
        ? section.title
        : key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    const content = Array.isArray(section.content)
      ? section.content.filter((item): item is string => typeof item === "string").join(", ")
      : typeof section.content === "string"
        ? section.content
        : "";
    const id = key
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .toLowerCase();

    return {
      field: { id: id || `section-${index + 1}`, label: title, value: content, multiline: true },
      order: typeof section.order === "number" ? section.order : index,
    };
  });

  fields.sort((left, right) => left.order - right.order);
  return { fileName, fields: fields.map(({ field }) => field) };
}

export default function UploadResumeComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isSavedResume, setIsSavedResume] = useState(false);
  const [savedFileName, setSavedFileName] = useState("Uploaded resume");
  const [showReview, setShowReview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<ResumeField[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    return () => revokePdfPreviewUrl(pdfUrl);
  }, [pdfUrl]);

  useEffect(() => {
    let active = true;

    getResume()
      .then(async (response) => {
        if (!active || response === null) return;

        const resume = normalizeResumeMetadata(response);
        if (!resume) return;

        setIsSavedResume(true);
        setSavedFileName(resume.fileName);
        setFields(resume.fields);
        setShowReview(true);

        setIsLoadingPreview(true);
        try {
          const downloaded = await getResumeFile();
          const fileName = downloaded.fileName || resume.fileName;
          if (await isPdfBlob(downloaded.blob, fileName)) {
            const previewBlob =
              downloaded.blob.type === "application/pdf"
                ? downloaded.blob
                : new Blob([downloaded.blob], { type: "application/pdf" });
            const previewUrl = URL.createObjectURL(previewBlob);
            if (active) {
              setPdfUrl(previewUrl);
            } else {
              URL.revokeObjectURL(previewUrl);
            }
          }
        } catch (previewLoadError) {
          if (active) {
            setPreviewError(
              previewLoadError instanceof Error
                ? previewLoadError.message
                : "Failed to load the resume preview."
            );
          }
        } finally {
          if (active) setIsLoadingPreview(false);
        }
      })
      .catch((resumeError) => {
        if (!active) return;
        const message =
          resumeError instanceof Error
            ? resumeError.message
            : "Failed to load your saved resume.";
        setLoadError(message);
      })
      .finally(() => {
        if (active) setIsLoadingResume(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function validateAndSetFile(file: File | null) {
    if (!file) return;

    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setError("File format should be .pdf, .doc or .docx.");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File must be less than 500 KB.");
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
  }

  function handleBrowseClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    validateAndSetFile(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    validateAndSetFile(event.dataTransfer.files?.[0] ?? null);
  }

  function resetReviewState() {
    revokePdfPreviewUrl(pdfUrl);
    setPdfUrl(null);
    setFields([]);
    setParseError(null);
    setSaveError(null);
    setPreviewError(null);
    setIsParsing(false);
    setShowReview(false);
  }

  function clearParsedData() {
    revokePdfPreviewUrl(pdfUrl);
    setPdfUrl(null);
    setFields([]);
    setParseError(null);
    setSaveError(null);
    setPreviewError(null);
    setIsParsing(false);
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setError(null);
    setIsSavedResume(false);
    resetReviewState();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setParseError(null);
    setSaveError(null);
    clearParsedData();
    setShowReview(true);
    setIsParsing(true);

    try {
      const nextPdfUrl = isPdfFile(selectedFile)
        ? createPdfPreviewUrl(selectedFile)
        : null;

      setPdfUrl(nextPdfUrl);

      if (isPdfFile(selectedFile)) {
        const text = await extractTextFromPdf(selectedFile);
        setFields(parseResumeText(text));
      } else {
        setFields([
          {
            id: "file-name",
            label: "File Name",
            value: selectedFile.name,
            multiline: false,
          },
          {
            id: "note",
            label: "Note",
            value:
              "Auto section extraction is available for PDF files. Please fill in your resume details manually.",
            multiline: true,
          },
        ]);
      }

    } catch (uploadError) {
      setParseError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to read resume content."
      );
      setShowReview(true);
    } finally {
      setIsParsing(false);
      setIsUploading(false);
    }
  }

  function handleFieldChange(id: string, value: string) {
    setFields((current) =>
      current.map((field) => (field.id === id ? { ...field, value } : field))
    );
  }

  function handleUploadAnother() {
    handleRemoveFile();
  }

  async function handleSaveResumeData() {
    if (!selectedFile && !isSavedResume) return;

    setIsSaving(true);
    setSaveError(null);

    const sections = toResumeSections(fields);

    try {
      let response;
      if (isSavedResume) {
        response = await updateResumeSections(sections);
      } else {
        if (!selectedFile) {
          throw new Error("Select a resume file before uploading.");
        }

        const formData = new FormData();
        formData.append("resume", selectedFile);
        formData.append("sections", JSON.stringify(sections));
        response = await uploadResume(formData);
      }

      if (response.success === false) {
        throw new Error(response.message || "Failed to save your resume.");
      }

      setIsSavedResume(true);
      if (selectedFile) setSavedFileName(selectedFile.name);
      useToastStore
        .getState()
        .showToast(
          response.message ||
            (isSavedResume
              ? "Resume sections updated successfully!"
              : "Resume uploaded successfully!")
        );
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to save your resume.";
      setSaveError(message);
      useToastStore.getState().showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDownloadResume() {
    setIsDownloading(true);
    setSaveError(null);

    try {
      const { blob, fileName } = await getResumeFile();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || savedFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      const message =
        downloadError instanceof Error
          ? downloadError.message
          : "Failed to download your resume.";
      setSaveError(message);
      useToastStore.getState().showToast(message, "error");
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleDeleteResume() {
    if (!window.confirm("Delete your saved resume and its uploaded file?")) return;

    setIsDeleting(true);
    setSaveError(null);

    try {
      const response = await deleteResume();
      if (response.success === false) {
        throw new Error(response.message || "Failed to delete your resume.");
      }

      handleRemoveFile();
      setSavedFileName("Uploaded resume");
      setLoadError(null);
      useToastStore
        .getState()
        .showToast(response.message || "Resume deleted successfully.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete your resume.";
      setSaveError(message);
      useToastStore.getState().showToast(message, "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div id="upload_resume">
      {isLoadingResume ? (
        <div className="upload-resume-card">
          <div className="upload-resume-body">
            <div className="resume-parsing-status">Loading your saved resume...</div>
          </div>
        </div>
      ) : showReview && (selectedFile || isSavedResume) ? (
        <ResumeReviewView
          fileName={selectedFile?.name ?? savedFileName}
          pdfUrl={pdfUrl}
          fields={fields}
          isParsing={isParsing}
          isSaving={isSaving}
          isSavedResume={isSavedResume}
          isDeleting={isDeleting}
          isDownloading={isDownloading}
          isLoadingPreview={isLoadingPreview}
          parseError={parseError}
          saveError={saveError}
          previewError={previewError}
          onFieldChange={handleFieldChange}
          onUploadAnother={handleUploadAnother}
          onSave={handleSaveResumeData}
          onDownload={handleDownloadResume}
          onDelete={handleDeleteResume}
        />
      ) : (
        <div className="upload-resume-card">
          <div className="card-header">
            <div className="title">Upload Resume</div>
          </div>
          <hr />

          <div className="upload-resume-body">
            <p className="intro">
              Upload your resume to preview the PDF and review editable sections
              extracted from the document.
            </p>

            <form
              className="upload-section"
              onSubmit={(event) => event.preventDefault()}
            >
              <div
                className={`dropzone ${isDragging ? "dragging" : ""} ${
                  selectedFile ? "has-file" : ""
                }`}
                onClick={handleBrowseClick}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleBrowseClick();
                  }
                }}
              >
                <Image
                  src="/assets/Images/upload-icon-resume.png"
                  alt="Upload resume"
                  width={40}
                  height={40}
                  className="upload-image-icon"
                />
                {selectedFile ? (
                  <div className="file-preview">
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                ) : (
                  <div className="empty">
                    <span className="primary">
                      Drag &amp; drop your CV/Resume here
                    </span>
                    <span className="secondary">or click to browse</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={handleFileChange}
              />

              {error && <div className="upload-error">{error}</div>}
              {loadError && <div className="upload-error">{loadError}</div>}

              <div className="buttons-upload">
                <button
                  type="button"
                  className="browse"
                  onClick={handleBrowseClick}
                >
                  Browse
                </button>
                {selectedFile && (
                  <button
                    type="button"
                    className="remove"
                    onClick={handleRemoveFile}
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  className="upload"
                  disabled={!selectedFile || isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? "Processing..." : "Upload"}
                </button>
              </div>
            </form>

            <div className="upload-rulls">
              <div className="rulls-title">Standard file uploading guideline</div>
              <div className="rulls">File must be less than 500 KB.</div>
              <div className="rulls">
                File format should be .pdf, .doc or .docx. PDF files support
                automatic section extraction.
              </div>
            </div>

            <div className="upload-resume-footer">
              CV attachment is the best way to stand out from the other candidates.
              Show your skills in your own way.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
