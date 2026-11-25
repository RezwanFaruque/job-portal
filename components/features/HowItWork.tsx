import React from "react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Create your profile",
    description:
      "Add your experience, skills, and the kind of work you want next.",
  },
  {
    number: "02",
    title: "Discover opportunities",
    description:
      "Search open roles, follow suggestions, and save the ones worth a second look.",
  },
  {
    number: "03",
    title: "Take your next step",
    description:
      "Review the details and apply when the opportunity feels right.",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="how-its-work" aria-labelledby="home-steps-title">
      <div className="container">
        <div className="home-section-heading is-split" data-home-reveal="up">
          <div>
            <span className="home-section-eyebrow">Your next move, made simpler</span>
            <h2 id="home-steps-title">Three steps to get started</h2>
          </div>
          <Link href="/browse-job" className="home-outline-link">
            Start exploring jobs <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="home-steps" data-home-reveal="up">
          <span className="home-steps-line" aria-hidden="true" />
          {steps.map((step) => (
            <article className="home-step" key={step.number}>
              <span className="home-step-index">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
