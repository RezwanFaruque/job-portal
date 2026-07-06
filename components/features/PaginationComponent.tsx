"use client";

import React from "react";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return Array.from(pages).sort((a, b) => a - b);
}

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="browse-job-pagination" aria-label="Job list pagination">
      <ul id="paginations">
        <li>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
          >
            First
          </button>
        </li>
        <li>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>

        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const showEllipsis = previousPage !== undefined && page - previousPage > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <li className="pagination-ellipsis" aria-hidden="true">
                  ...
                </li>
              )}
              <li className="pagination-item">
                <button
                  type="button"
                  className={page === currentPage ? "active" : ""}
                  aria-current={page === currentPage ? "page" : undefined}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            </React.Fragment>
          );
        })}

        <li>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
        <li>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
}
