"use client";

import Image from "next/image";
import OurService from "@/components/features/OurService";
import CareerDevelopmentSection from "@/components/features/CareerDevelopment";
import HowItWorksSection from "@/components/features/HowItWork";
import SubscribeSection from "@/components/features/Subscription";

export default function Home() {
  return (
    <div id="index-page">
        <section id="bannar-section">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 d-flex align-items-center">
                <div className="left-side">
                  <h1 className="title">
                    Find Your <span>Dream Job</span> Today
                  </h1>
                  <p className="subtitle">
                    Explore thousands of job opportunities tailored to your skills and interests.
                  </p>
                  <div className="search-section">
                    <form>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Job title or keyword"
                          aria-label="Job search"
                        />
                        <button className="btn" type="submit">
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="right-side d-none d-md-block">
                  <div className="bn-image">
                    <img
                      className="bannar-vector"
                      src="/assets/images/bannar-vector.png"
                      alt="Job search illustration"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <OurService />
        <CareerDevelopmentSection />
        <HowItWorksSection />
        <SubscribeSection />
    </div>
  );
}
