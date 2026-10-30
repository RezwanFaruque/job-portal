"use client";

import { useMemo, useState } from "react";
import BlogPostCard from "@/components/features/BlogPostCard";
import { BLOG_POSTS } from "@/constants/blogPosts";

export default function BlogListing() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All articles");
  const categories = [
    "All articles",
    ...Array.from(new Set(BLOG_POSTS.map((post) => post.category))),
  ];

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        category === "All articles" || post.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${post.title} ${post.excerpt} ${post.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <main id="our_blog">
      <div className="container">
        <header className="blog-page-heading">
          <div>
            <span className="blog-eyebrow">Career resources</span>
            <h1>Ideas for your next career move</h1>
            <p>
              Practical advice for finding opportunities, growing your skills,
              and moving forward with confidence.
            </p>
          </div>
        </header>

        <section className="blog-library" aria-label="Career articles">
          <div className="blog-library-toolbar">
            <div className="blog-category-filters" aria-label="Filter by category">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={category === item ? "active" : ""}
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="blog-search">
              <span className="visually-hidden">Search articles</span>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <input
                type="search"
                placeholder="Search articles"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <p className="blog-results-count" aria-live="polite">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "article" : "articles"}
          </p>

          {filteredPosts.length ? (
            <div className="blog-post-grid">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="blog-empty-state">
              <h2>No articles found</h2>
              <p>Try a different search or choose another category.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All articles");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
