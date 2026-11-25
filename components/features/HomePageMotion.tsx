"use client";

import { useEffect } from "react";

export default function HomePageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-modern");
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = root.querySelectorAll<HTMLElement>("[data-home-reveal]");
    const staggerGroups = root.querySelectorAll<HTMLElement>(
      "[data-home-reveal-stagger]"
    );

    if (!reduced && (elements.length || staggerGroups.length)) {
      root.classList.add("home-motion-enabled");
    }

    let observer: IntersectionObserver | null = null;
    let mutations: MutationObserver | null = null;

    if (!reduced && (elements.length || staggerGroups.length) && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("home-reveal-visible");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
      );

      const observed = new WeakSet<Element>();
      const observe = (element: Element) => {
        if (observed.has(element) || !observer) return;
        observed.add(element);
        observer.observe(element);
      };

      elements.forEach(observe);
      staggerGroups.forEach(observe);

      mutations = new MutationObserver((records) => {
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
    } else {
      elements.forEach((element) => element.classList.add("home-reveal-visible"));
      staggerGroups.forEach((element) => element.classList.add("home-reveal-visible"));
    }

    const hero = root.querySelector<HTMLElement>("#bannar-section");
    const stage = root.querySelector<HTMLElement>("[data-home-parallax]");
    const spotlight = root.querySelector<HTMLElement>(".home-hero-spotlight");
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (!hero || reduced) return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        hero.style.setProperty("--hero-x", x.toFixed(3));
        hero.style.setProperty("--hero-y", y.toFixed(3));
        if (spotlight) {
          spotlight.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
          spotlight.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
        }
      });
    };

    const onPointerLeave = () => {
      hero?.style.setProperty("--hero-x", "0");
      hero?.style.setProperty("--hero-y", "0");
    };

    if (hero && stage && !reduced) {
      hero.addEventListener("pointermove", onPointerMove);
      hero.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      mutations?.disconnect();
      observer?.disconnect();
      cancelAnimationFrame(frame);
      hero?.removeEventListener("pointermove", onPointerMove);
      hero?.removeEventListener("pointerleave", onPointerLeave);
      root.classList.remove("home-motion-enabled");
    };
  }, []);

  return null;
}
