"use client";

import React from "react";

const PaginationComponent: React.FC = () => (
  <ul id="paginations">
    <li>
      <button type="button" disabled>
        First
      </button>
    </li>
    <li>
      <button type="button" disabled>
        Previous
      </button>
    </li>

    {[1, 2, 3].map((p) => (
      <li className="pagination-item" key={p}>
        <button
          type="button"
          disabled={p === 1}
          className={p === 1 ? "active" : ""}
        >
          {p}
        </button>
      </li>
    ))}

    <li>
      <button type="button">Next</button>
    </li>
    <li>
      <button type="button">Last</button>
    </li>
  </ul>
);

export default PaginationComponent;

