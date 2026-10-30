"use client";

import Image from "next/image";
import OurService from "@/components/features/OurService";
import CareerDevelopmentSection from "@/components/features/CareerDevelopment";
import HowItWorksSection from "@/components/features/HowItWork";
import SubscribeSection from "@/components/features/Subscription";
import HomeJobCategories from "@/components/features/HomeJobCategories";
import HomeJobToolkit from "@/components/features/HomeJobToolkit";
import HomePageMotion from "@/components/features/HomePageMotion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


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
        <section id="bannar-section">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 d-flex align-items-center">
                <div className="left-side" data-home-reveal="from-left">
                  <div className="hero-eyebrow">
                    <span className="hero-eyebrow-dot" />
                    A better way to find your next role
                  </div>
                  <h1 className="title">
                    Find work that moves <span>you forward.</span>
                  </h1>
                  <p className="subtitle">
                    Discover opportunities that fit your skills, build your
                    profile, and take the next step in your career.
                  </p>
                  <div className="search-section">
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
                  <div className="hero-supporting-links">
                    <span>Explore opportunities:</span>
                    <Link href="/browse-job">Browse all jobs</Link>
                    <span aria-hidden="true">·</span>
                    <Link href="/our-blog">Career advice</Link>
                  </div>
                </div>
                <div className="right-side d-none d-md-block" data-home-reveal="from-right">
                  <div className="bn-image">
                    <Image
                      className="bannar-vector"
                      src="/assets/Images/bannar-vector.png"
                      alt="Job search illustration"
                      width={900}
                      height={700}
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <OurService />
        <HomeJobCategories />
        <HomeJobToolkit />
        <CareerDevelopmentSection />
        <HowItWorksSection />
        <SubscribeSection />
    </div>
  );
}
