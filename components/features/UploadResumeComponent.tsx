"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

export default function UploadResumeComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleBrowseClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  return (
    <div id="upload_resume">
      <div className="upload-resume-card">
        <div className="title">Upload Resume</div>
        <hr />
        <div className="upload-resume-body">
          <div className="title">
            In this section you can upload your resume. Here you can take help from the
            video attached in the right corner of CV attachment bar. Also you can get
            help from instructions given below.
          </div>

          <div className="upload-section">
            <form onSubmit={(event) => event.preventDefault()}>
              <div className="image-section">
                <Image
                  src="/assets/Images/upload-icon-resume.png"
                  alt="Upload resume"
                  width={32}
                  height={32}
                  className="upload-image-icon"
                />
                <div className="empty">
                  {selectedFile
                    ? selectedFile.name
                    : "You didn't upload any CV/Resume yet."}
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={handleFileChange}
              />

              <div className="buttons-upload">
                <button type="button" className="browse" onClick={handleBrowseClick}>
                  Browse
                </button>
                <button type="button" className="upload">
                  Upload
                </button>
              </div>
            </form>
          </div>

          <div className="upload-rulls">
            <div className="rulls-title">Standard file uploading guideline</div>
            <div className="rulls">- File must be less than 500 KB.</div>
            <div className="rulls">- File format should be .pdf, .doc or .docx.</div>
          </div>

          <div className="upload-resume-footer">
            CV attachment is the best way to stand out from the other candidates. Show
            your skills on your own way.
          </div>
        </div>
      </div>
    </div>
  );
}
