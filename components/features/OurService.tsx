"use client";

import React from "react";
import Link from "next/link";

const services = [
  {
    title: "Build your profile",
    description:
      "Show your experience, skills, and goals in a profile employers can actually read.",
    link: "/profile",
    linkText: "Complete your profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19.2c.8-3 3.3-4.7 6.5-4.7s5.7 1.7 6.5 4.7" />
      </svg>
    ),
  },
  {
    title: "Find your next role",
    description:
      "Search open roles, save the ones that fit, and keep the search in one place.",
    link: "/browse-job",
    linkText: "Explore open jobs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <path d="m15.8 15.8 3.7 3.7" />
      </svg>
    ),
  },
  {
    title: "Find the right talent",
    description:
      "Share an opening with people who are already looking for the kind of work you do.",
    link: "/post-job/primary-job-information",
    linkText: "Post a job",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4.5 17.5V8.8L12 5l7.5 3.8v8.7" />
        <path d="M9 17.5v-4.2h6v4.2" />
      </svg>
    ),
  },
];

const OurService: React.FC = () => {
  return (
    <section className="our-services" aria-label="Ways to use Jobpot">
      <div className="container">
        <div className="home-section-heading is-split" data-home-reveal="up">
          <div>
            <span className="home-section-eyebrow">One platform, more possibilities</span>
            <h2>Make your next move with confidence</h2>
          </div>
          <p className="home-section-aside">
            A clear path for job seekers and hiring teams, from the first profile to the next opening.
          </p>
        </div>
        <div className="home-path-list" data-home-reveal-stagger>
          {services.map((service, index) => (
            <Link className="home-path" href={service.link} key={service.title}>
              <span className="home-path-index">0{index + 1}</span>
              <span className="home-path-icon">{service.icon}</span>
              <span className="home-path-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </span>
              <span className="home-path-go">
                {service.linkText} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurService;
