"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How do I search for a job?",
    answer:
      "Use the search on the home page or open Browse a Job. You can look by title, skill, or keyword, then narrow the list by category.",
  },
  {
    question: "Do I need an account to apply?",
    answer:
      "Sign in before you apply so the application stays attached to your profile. You can still browse open roles before creating an account.",
  },
  {
    question: "Where do saved jobs go?",
    answer:
      "Choose save on a role and it stays in Save for later. You can reopen that list whenever you want to compare openings.",
  },
  {
    question: "How do I post a job?",
    answer:
      "Open Post a Job and add the primary information for the role. You can review the details before the listing is shared.",
  },
  {
    question: "Can I update my resume later?",
    answer:
      "Yes. Build or upload a resume, then return to View resume whenever your experience or skills change.",
  },
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="home-faq" aria-labelledby="home-faq-title">
      <div className="container">
        <div className="home-faq-layout">
          <header className="home-faq-intro" data-home-reveal="from-left">
            <span className="home-section-eyebrow">Questions, answered</span>
            <h2 id="home-faq-title">A few things people ask first.</h2>
            <p>
              Short answers for searching, saving, applying, and posting. The rest of the product stays one click away.
            </p>
          </header>

          <div className="home-faq-list" data-home-reveal="up">
            {faqs.map((item, index) => {
              const open = openIndex === index;
              const panelId = `home-faq-panel-${index}`;
              const buttonId = `home-faq-button-${index}`;

              return (
                <article className={`home-faq-item ${open ? "is-open" : ""}`} key={item.question}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? -1 : index)}
                    >
                      <span>{item.question}</span>
                      <span className="home-faq-icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    className="home-faq-panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!open}
                  >
                    <div className="home-faq-panel-inner">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
