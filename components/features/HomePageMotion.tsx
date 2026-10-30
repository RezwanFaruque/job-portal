"use client";

import { useEffect } from "react";

export default function HomePageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-modern");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const elements = root.querySelectorAll<HTMLElement>("[data-home-reveal]");
    const staggerGroups = root.querySelectorAll<HTMLElement>(
      "[data-home-reveal-stagger]"
    );
    if (!elements.length && !staggerGroups.length) return;

    root.classList.add("home-motion-enabled");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("home-reveal-visible"));
      staggerGroups.forEach((element) =>
        element.classList.add("home-reveal-visible")
      );
      return () => root.classList.remove("home-motion-enabled");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("home-reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    const observed = new WeakSet<Element>();
    const observe = (element: Element) => {
      if (observed.has(element)) return;
      observed.add(element);
      observer.observe(element);
    };

    elements.forEach(observe);
    staggerGroups.forEach(observe);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-home-reveal], [data-home-reveal-stagger]")) {
            observe(node);
          }
          node
            .querySelectorAll("[data-home-reveal], [data-home-reveal-stagger]")
            .forEach(observe);
        });
      });
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      root.classList.remove("home-motion-enabled");
    };
  }, []);

  return null;
}
