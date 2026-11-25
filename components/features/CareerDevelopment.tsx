import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/constants/blogPosts";

const CareerDevelopmentSection: React.FC = () => {
  const [feature, ...rest] = BLOG_POSTS.slice(0, 3);

  if (!feature) return null;

  return (
    <section className="cr-dev-and-learning" aria-labelledby="home-journal-title">
      <div className="container">
        <div className="home-section-heading is-split" data-home-reveal="up">
          <div>
            <span className="home-section-eyebrow">Ideas for what comes next</span>
            <h2 id="home-journal-title">Career development &amp; learning</h2>
          </div>
          <div className="home-section-aside">
            <p>Practical guidance for the resume, the interview, and the skills in between.</p>
            <Link className="home-text-link" href="/our-blog">
              Explore all articles <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="home-journal" data-home-reveal-stagger>
          <Link className="home-journal-feature" href={`/our-blog/${feature.slug}`}>
            <Image
              src={feature.image}
              alt=""
              width={960}
              height={720}
            />
            <span className="home-journal-shade" />
            <span className="home-journal-feature-copy">
              <span className="home-journal-meta">
                {feature.category} <span aria-hidden="true">·</span> {feature.readTime}
              </span>
              <strong>{feature.title}</strong>
              <span>{feature.excerpt}</span>
            </span>
          </Link>

          <div className="home-journal-side">
            {rest.map((card) => (
              <Link className="home-journal-item" href={`/our-blog/${card.slug}`} key={card.slug}>
                <span className="home-journal-thumb">
                  <Image src={card.image} alt="" width={240} height={180} />
                </span>
                <span className="home-journal-item-copy">
                  <span className="home-journal-meta">
                    {card.category} <span aria-hidden="true">·</span> {card.readTime}
                  </span>
                  <strong>{card.title}</strong>
                  <span className="home-journal-read">
                    Read article <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerDevelopmentSection;
