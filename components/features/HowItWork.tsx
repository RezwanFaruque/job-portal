import React from "react";
import Link from "next/link";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Create your profile",
      description:
        "Add your experience, skills, and career interests to introduce yourself to employers.",
    },
    {
      number: "02",
      title: "Discover opportunities",
      description:
        "Search open roles, explore suggestions, and save the jobs you want to revisit.",
    },
    {
      number: "03",
      title: "Take your next step",
      description:
        "Review the details, prepare your application, and apply when the opportunity feels right.",
    },
  ];

  return (
    <section className="how-its-work">
      <div className="container">
        <div className="home-section-heading" data-home-reveal="up">
          <span className="home-section-eyebrow">Your next move, made simpler</span>
          <h2>Three steps to get started</h2>
          <p>A clear path from exploring roles to making your next move.</p>
        </div>
        <div className="how-it-works-grid" data-home-reveal-stagger>
          {steps.map((step) => (
            <article className="how-it-works-card" key={step.number}>
              <span className="how-it-works-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
        <div className="how-it-works-action">
          <Link href="/browse-job">Start exploring jobs <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;