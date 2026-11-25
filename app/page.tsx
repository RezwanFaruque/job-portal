"use client";

import OurService from "@/components/features/OurService";
import CareerDevelopmentSection from "@/components/features/CareerDevelopment";
import HowItWorksSection from "@/components/features/HowItWork";
import SubscribeSection from "@/components/features/Subscription";
import HomeJobCategories from "@/components/features/HomeJobCategories";
import HomeJobToolkit from "@/components/features/HomeJobToolkit";
import HomePageMotion from "@/components/features/HomePageMotion";
import HomeVideoSection from "@/components/features/HomeVideoSection";
import HomeFaq from "@/components/features/HomeFaq";
import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HERO_ROLES = [
  "Product Design",
  "Engineering",
  "Data",
  "Marketing",
  "Operations",
  "Finance",
  "Customer Success",
  "Research",
];

export default function Home() {

  const [ title , setTitle ]= useState('');
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (title.trim()) params.set("keyword", title.trim());
    const query = params.toString();
    router.push(query ? `/browse-job?${query}` : "/browse-job");
  }

  return (
    <div id="index-page" className="home-modern">
        <HomePageMotion />
        <section id="bannar-section" className="home-hero">
          <div className="home-hero-atmosphere" aria-hidden="true">
            <span className="home-orb home-orb-a" />
            <span className="home-orb home-orb-b" />
            <span className="home-orb home-orb-c" />
            <span className="home-hero-grid" />
            <span className="home-hero-spotlight" />
          </div>
          <div className="container">
            <div className="row">
              <div className="col-sm-12 d-flex align-items-center">
                <div className="left-side">
                  <div className="hero-eyebrow home-intro" style={{ "--home-intro-delay": "80ms" } as CSSProperties}>
                    <span className="hero-eyebrow-dot" />
                    A better way to find your next role
                  </div>
                  <h1 className="title">
                    <span className="home-line">
                      <span className="home-word" style={{ "--home-word-delay": "160ms" } as CSSProperties}>Find</span>
                      <span className="home-word" style={{ "--home-word-delay": "240ms" } as CSSProperties}>work</span>
                      <span className="home-word" style={{ "--home-word-delay": "320ms" } as CSSProperties}>that</span>
                    </span>
                    <span className="home-line">
                      <span className="home-word" style={{ "--home-word-delay": "400ms" } as CSSProperties}>moves</span>
                      <span className="home-word home-word-accent" style={{ "--home-word-delay": "500ms" } as CSSProperties}>you forward.</span>
                    </span>
                  </h1>
                  <p className="subtitle home-intro" style={{ "--home-intro-delay": "620ms" } as CSSProperties}>
                    Discover opportunities that fit your skills, build your
                    profile, and take the next step in your career.
                  </p>
                  <div className="search-section home-intro" style={{ "--home-intro-delay": "740ms" } as CSSProperties}>
                    <form onSubmit={handleSubmit}>
                      <div className="input-group hero-search">
                        <span className="hero-search-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="10.8" cy="10.8" r="6.8" />
                            <path d="m16 16 4.5 4.5" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Job title, skill, or keyword"
                          aria-label="Search jobs by title, skill, or keyword"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        <button className="btn" type="submit">
                          Find jobs
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="hero-supporting-links home-intro" style={{ "--home-intro-delay": "880ms" } as CSSProperties}>
                    <span>Explore opportunities:</span>
                    <Link href="/browse-job">Browse all jobs</Link>
                    <span aria-hidden="true">·</span>
                    <Link href="/our-blog">Career advice</Link>
                  </div>
                </div>
                <div className="right-side d-none d-md-flex" data-home-parallax>
                  <div className="home-hero-stage" aria-hidden="true">
                    <span className="home-orbit" />
                    <span className="home-orbit home-orbit-inner" />
                    <div className="home-parallax-layer home-layer-a" style={{ "--depth": "10" } as CSSProperties}>
                      <article className="home-float-card home-float-card-a">
                        <span className="home-float-kicker">New match</span>
                        <strong>Product Designer</strong>
                        <span>Remote · Design</span>
                      </article>
                    </div>
                    <div className="home-parallax-layer home-layer-b" style={{ "--depth": "22" } as CSSProperties}>
                      <article className="home-float-card home-float-card-b">
                        <span className="home-float-kicker">Open role</span>
                        <strong>Frontend Engineer</strong>
                        <span>Hybrid · Engineering</span>
                      </article>
                    </div>
                    <div className="home-parallax-layer home-layer-c" style={{ "--depth": "6" } as CSSProperties}>
                      <article className="home-float-card home-float-card-c">
                        <span className="home-match-ring" />
                        <div>
                          <strong>Profile ready</strong>
                          <span>Skills lined up for your next application</span>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-marquee" aria-hidden="true">
            <div className="home-marquee-track">
              {HERO_ROLES.concat(HERO_ROLES).map((role, index) => (
                <span key={`${role}-${index}`}>{role}</span>
              ))}
            </div>
          </div>
        </section>
        <HowItWorksSection />
        <OurService />
        <HomeJobCategories />
        <HomeJobToolkit />
        <HomeVideoSection />
        <CareerDevelopmentSection />
        <HomeFaq />
        <SubscribeSection />
    </div>
  );
}
