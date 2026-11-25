"use client";

import React, { useState } from "react";

const SubscribeSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="subscribe" aria-labelledby="home-subscribe-title">
      <div className="container">
        <div className="home-subscribe" data-home-reveal="up">
          <div className="home-subscribe-copy">
            <span className="home-section-eyebrow">Newsletter</span>
            <h2 id="home-subscribe-title">Notes worth opening.</h2>
            <p>
              A short letter with career ideas, useful roles, and stories from people
              making their next move.
            </p>
          </div>

          {submitted ? (
            <p className="home-subscribe-thanks" role="status">
              Thanks. You&apos;re on the list for the next letter.
            </p>
          ) : (
            <form className="home-subscribe-form" onSubmit={handleSubmit}>
              <label className="visually-hidden" htmlFor="home-newsletter-email">
                Email address
              </label>
              <input
                id="home-newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                autoComplete="email"
              />
              <button type="submit">Subscribe</button>
              <p>Occasional notes. Unsubscribe whenever you like.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
