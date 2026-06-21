"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface JobCardMenuProps {
  jobId: string;
}

export default function JobCardMenu({ jobId }: JobCardMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="job-card-menu" ref={menuRef}>
      <button
        type="button"
        className="dot-text"
        aria-label="Job options"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      />
      {open && (
        <div className="job-card-menu-dropdown">
          <Link
            href={`/browse-job/${jobId}`}
            className="job-card-menu-item"
            onClick={() => setOpen(false)}
          >
            Job Details
          </Link>
        </div>
      )}
    </div>
  );
}
