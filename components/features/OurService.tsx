"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const OurService: React.FC = () => {
  const services = [
    {
      icon: "/assets/Images/our-service-one.png",
      title: "Build your profile",
      description:
        "Showcase your experience, skills, and goals with a profile that helps employers understand what you bring.",
      link: "/profile",
      linkText: "Complete your profile",
    },
    {
      icon: "/assets/Images/our-service-two.png",
      title: "Find your next role",
      description:
        "Explore opportunities, save promising roles, and keep your job search organized in one place.",
      link: "/browse-job",
      linkText: "Explore open jobs",
    },
    {
      icon: "/assets/Images/our-service-three.png",
      title: "Find the right talent",
      description:
        "Reach motivated candidates and share your next opportunity with the people who fit your team.",
      link: "/post-job/primary-job-information",
      linkText: "Post a job",
    },
  ];

  return (
    <section className="our-services" aria-label="Ways to use Jobpot">
      <div className="container">
        <div className="home-section-heading">
          <span className="home-section-eyebrow">One platform, more possibilities</span>
          <h2>Make your next move with confidence</h2>
          <p>Tools for every step of your job search and hiring journey.</p>
        </div>
        <div className="row" data-home-reveal-stagger>
          {services.map((service, index) => (
            <div className="col-lg-4 col-md-6 col-sm-12" key={service.title}>
              <article className={`service-card service-card-${index + 1}`}>
                <div className="service-icon">
                  <Image src={service.icon} alt="" width={68} height={68} />
                </div>
                <span className="service-step">0{index + 1}</span>
                <h3 className="title">{service.title}</h3>
                <p className="short-description">{service.description}</p>
                <div className="footer">
                  <Link href={service.link}>
                    {service.linkText} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurService;
