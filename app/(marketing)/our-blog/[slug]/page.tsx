import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogPostCard from "@/components/features/BlogPostCard";
import { BLOG_POSTS } from "@/constants/blogPosts";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return BLOG_POSTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  return {
    title: post ? `${post.title} | Job Portal` : "Article not found | Job Portal",
    description: post?.excerpt,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) notFound();

  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <main id="our_blog_details">
      <div className="container">
        <Link href="/our-blog" className="blog-back-link">
          <span aria-hidden="true">←</span> All articles
        </Link>

        <article className="blog-article">
          <header className="blog-article-header">
            <Image
              src={post.image}
              alt=""
              width={1440}
              height={720}
              className="blog-article-image"
              priority
            />
            <div className="blog-article-image-overlay" />
            <div className="blog-article-heading">
              <span className="blog-category">{post.category}</span>
              <h1>{post.title}</h1>
              <p>
                {formatDate(post.publishedAt)} <span aria-hidden="true">·</span>{" "}
                {post.readTime}
              </p>
            </div>
          </header>

          <div className="blog-article-content">
            <p className="blog-article-introduction">{post.introduction}</p>
            {post.sections.map((section) => (
              <section className="blog-article-section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <div className="blog-article-cta">
              <div>
                <h2>Ready for your next opportunity?</h2>
                <p>Explore roles and find a position that fits your goals.</p>
              </div>
              <Link href="/browse-job">Browse jobs</Link>
            </div>
          </div>
        </article>

        <section className="related-articles" aria-labelledby="related-articles-title">
          <div className="related-articles-heading">
            <div>
              <span className="blog-eyebrow">Keep exploring</span>
              <h2 id="related-articles-title">More career resources</h2>
            </div>
            <Link href="/our-blog">View all articles</Link>
          </div>
          <div className="blog-post-grid">
            {relatedPosts.map((relatedPost) => (
              <BlogPostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
