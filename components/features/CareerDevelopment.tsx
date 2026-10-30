import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/constants/blogPosts";

const CareerDevelopmentSection: React.FC = () => {
  const cards = BLOG_POSTS.slice(0, 3);

  return (
    <section className="cr-dev-and-learning">
      <div className="home-section-heading" data-home-reveal="up">
        <span className="home-section-eyebrow">Ideas for what comes next</span>
        <h2>Career development &amp; learning</h2>
        <p>Practical guidance to help you move forward with clarity.</p>
      </div>

      <div className="body">
        <div className="container">
          <div className="row" data-home-reveal-stagger>
            {cards.map((card) => (
              <div className="col-lg-4 col-md-6 col-sm-12" key={card.slug}>
                <div className="cr-dev-card">
                  <div className="header">
                    <div className="image">
                      <Image
                        className="cr-dev-img"
                        src={card.image}
                        alt={card.title}
                        width={640}
                        height={400}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="sub-header">
                      <div className="title">{card.title}</div>
                      <div className="date">
                        {card.category} <span aria-hidden="true">·</span> {card.readTime}
                      </div>
                    </div>
                  </div>
                  <div className="body">{card.excerpt}</div>
                  <div className="footer">
                    <Link href={`/our-blog/${card.slug}`}>
                      Read article <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="read-more">
          <Link className="view-all" href="/our-blog">Explore all articles</Link>
        </div>
      </div>
    </section>
  );
};

export default CareerDevelopmentSection;