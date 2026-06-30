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
import { useToastStore } from "@/store/toastStore";

const MAX_FILE_SIZE = 500 * 1024;
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdfFile(file: File) {
  return file.name.toLowerCase().endsWith(".pdf");
}

export default function UploadResumeComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<ResumeField[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    return () => revokePdfPreviewUrl(pdfUrl);
  }, [pdfUrl]);

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
    setIsParsing(false);
    setShowReview(false);
  }

  function clearParsedData() {
    revokePdfPreviewUrl(pdfUrl);
    setPdfUrl(null);
    setFields([]);
    setParseError(null);
    setIsParsing(false);
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setError(null);
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

      useToastStore.getState().showToast("Resume uploaded successfully!");
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

  function handleSaveResumeData() {
    useToastStore.getState().showToast("Resume details saved locally.");
  }

  return (
    <div id="upload_resume">
      {showReview && selectedFile ? (
        <ResumeReviewView
          fileName={selectedFile.name}
          pdfUrl={pdfUrl}
          fields={fields}
          isParsing={isParsing}
          parseError={parseError}
          onFieldChange={handleFieldChange}
          onUploadAnother={handleUploadAnother}
          onSave={handleSaveResumeData}
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
