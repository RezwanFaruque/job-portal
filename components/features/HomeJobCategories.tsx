"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCategoryStore } from "@/store/categoryStore";

export default function HomeJobCategories() {
  const categories = useCategoryStore((state) => state.categories);
  const getCategories = useCategoryStore((state) => state.getCategories);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategories().finally(() => setIsLoading(false));
  }, [getCategories]);

  const featuredCategories = categories.slice(0, 8);

  return (
    <section className="home-job-categories" aria-labelledby="home-categories-title">
      <div className="container">
        <div className="home-section-heading is-split" data-home-reveal="up">
          <div>
            <span className="home-section-eyebrow">Explore your options</span>
            <h2 id="home-categories-title">Find a field that fits your future</h2>
          </div>
          <Link href="/browse-job" className="home-outline-link">
            Browse all jobs <span aria-hidden="true">→</span>
          </Link>
        </div>

        {isLoading ? (
          <p className="home-category-empty" role="status">Loading job categories...</p>
        ) : featuredCategories.length ? (
          <div
            className={`home-field-grid ${
              featuredCategories.length === 1 ? "home-field-grid-single" : ""
            }`}
            data-home-reveal-stagger
          >
            {featuredCategories.map((category) => (
              <Link
                className="home-field"
                href={`/browse-job?category=${encodeURIComponent(category.name)}`}
                key={category._id}
              >
                <span className="home-field-mark" aria-hidden="true">
                  {category.name.trim().charAt(0).toUpperCase()}
                </span>
                <span className="home-field-name">{category.name}</span>
                <span className="home-field-go">
                  View roles <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="home-category-empty">
            Browse open roles and explore the available job categories.
          </p>
        )}
      </div>
    </section>
  );
}
