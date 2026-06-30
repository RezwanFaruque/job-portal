"use client";

import React from "react";
import type { ResumeField } from "@/lib/parseResumeText";

interface ResumeReviewViewProps {
  fileName: string;
  pdfUrl: string | null;
  fields: ResumeField[];
  isParsing: boolean;
  parseError: string | null;
  onFieldChange: (id: string, value: string) => void;
  onUploadAnother: () => void;
  onSave: () => void;
}

export default function ResumeReviewView({
  fileName,
  pdfUrl,
  fields,
  isParsing,
  parseError,
  onFieldChange,
  onUploadAnother,
  onSave,
}: ResumeReviewViewProps) {
  return (
    <div className="upload-resume-card resume-review-card">
      <div className="card-header resume-review-header">
        <div>
          <div className="title">Resume Details</div>
          <p className="resume-review-subtitle">
            Review and edit the content extracted from your resume.
          </p>
        </div>
        <div className="resume-review-actions">
          <button type="button" className="secondary" onClick={onUploadAnother}>
            Upload Another
          </button>
          <button type="button" className="primary" onClick={onSave} disabled={isParsing}>
            Save Resume Data
          </button>
        </div>
      </div>
      <hr />

      <div className="resume-review-body">
        <div className="resume-fields-panel">
          <div className="panel-title">Resume Content</div>
          <div className="panel-file-name">{fileName}</div>

          {isParsing && (
            <div className="resume-parsing-status">Reading resume sections...</div>
          )}

          {parseError && <div className="resume-parse-error">{parseError}</div>}

          {!isParsing && fields.length === 0 && (
            <div className="resume-parsing-status">
              No readable sections were found in this file.
            </div>
          )}

          <div className="resume-fields-list">
            {fields.map((field) => (
              <div key={field.id} className="resume-field-row">
                <label htmlFor={`resume-field-${field.id}`}>{field.label}</label>
                {field.multiline ? (
                  <textarea
                    id={`resume-field-${field.id}`}
                    value={field.value}
                    rows={Math.min(8, Math.max(4, field.value.split("\n").length + 1))}
                    onChange={(event) => onFieldChange(field.id, event.target.value)}
                  />
                ) : (
                  <input
                    id={`resume-field-${field.id}`}
                    type="text"
                    value={field.value}
                    onChange={(event) => onFieldChange(field.id, event.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="resume-preview-panel">
          <div className="panel-title">PDF Preview</div>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title={`Preview of ${fileName}`}
              className="resume-pdf-frame"
            />
          ) : (
            <div className="resume-preview-placeholder">
              Preview is available for PDF files only.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
