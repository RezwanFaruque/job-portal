import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/constants/blogPosts";

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPostCard({ post} : { post : BlogPost}) {
  return (
    <article className="blog-post-card">
      <Link
        href={`/our-blog/${post.slug}`}
        className="blog-post-image-link"
        aria-label={`Read ${post.title}`}
      >
        <Image
          src={post.image}
          alt=""
          width={640}
          height={400}
          className="blog-post-image"
        />
      </Link>
      <div className="blog-post-card-content">
        <div className="blog-post-meta">
          <span className="blog-category">{post.category}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        <h2>
          <Link href={`/our-blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        <div className="blog-post-card-footer">
          <span>{post.readTime}</span>
          <Link href={`/our-blog/${post.slug}`} aria-label={`Read ${post.title}`}>
            Read article <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
