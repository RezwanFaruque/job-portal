"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DASHBOARD_PREFIXES = [
  "/profile",
  "/build-resume",
  "/view-resume",
  "/upload-resume",
  "/applied-job",
  "/save-for-later",
  "/suggested-job",
  "/change-password",
  "/help",
];

export function isPublicPage(pathname: string) {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return false;
  return !DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function wheelDelta(event: WheelEvent) {
  let delta = event.deltaY;
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= window.innerHeight;
  return delta;
}

function eventStaysInNestedScroller(event: WheelEvent) {
  for (const node of event.composedPath()) {
    if (!(node instanceof HTMLElement)) continue;
    if (node === document.body || node === document.documentElement) break;
    if (node.classList.contains("modal-overlay")) return true;

    const overflowY = getComputedStyle(node).overflowY;
    const canScroll =
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight + 1;
    if (!canScroll) continue;

    if (event.deltaY < 0 && node.scrollTop > 0) return true;
    if (
      event.deltaY > 0 &&
      node.scrollTop + node.clientHeight < node.scrollHeight - 1
    ) {
      return true;
    }
  }
  return false;
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const root = document.documentElement;
    root.dataset.smoothScroll = "on";

    let target = window.scrollY;
    let current = window.scrollY;
    let expected = window.scrollY;
    let frame = 0;
    let running = false;
    let last = performance.now();

    const limit = () =>
      Math.max(0, root.scrollHeight - window.innerHeight);

    const jumpTo = (top: number) => {
      expected = top;
      window.scrollTo({ top, left: 0, behavior: "instant" });
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(34, now - last);
      last = now;
      const step = 1 - Math.pow(0.9, dt / 16.67);
      target = Math.min(limit(), Math.max(0, target));
      current += (target - current) * step;

      if (Math.abs(target - current) < 0.5) {
        current = target;
        jumpTo(current);
        stop();
        return;
      }

      jumpTo(current);
      if (!running) return;
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (eventStaysInNestedScroller(event)) return;

      event.preventDefault();
      if (!running) {
        current = window.scrollY;
        target = window.scrollY;
      }
      target = Math.min(limit(), Math.max(0, target + wheelDelta(event)));
      start();
    };

    const onScroll = () => {
      if (Math.abs(window.scrollY - expected) <= 2) return;
      stop();
      current = window.scrollY;
      target = window.scrollY;
      expected = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      stop();
      delete root.dataset.smoothScroll;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
