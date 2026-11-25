"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_ID = "aqz-KE-bpKQ";

export default function HomeVideoSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      stage.style.setProperty("--video-p", "0");
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = stage.getBoundingClientRect();
      const distance = stage.offsetHeight - window.innerHeight;
      const progress = distance <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / distance));
      stage.style.setProperty("--video-p", progress.toFixed(3));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function toggleSound() {
    const player = playerRef.current?.contentWindow;
    if (!player) return;
    player.postMessage(
      JSON.stringify({
        event: "command",
        func: soundOn ? "mute" : "unMute",
        args: [],
      }),
      "*"
    );
    setSoundOn((value) => !value);
  }

  const src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${VIDEO_ID}&enablejsapi=1`;

  return (
    <section className="home-video" aria-labelledby="home-video-title">
      <div className="container">
        <div className="home-section-heading is-split" data-home-reveal="up">
          <div>
            <span className="home-section-eyebrow">See it in motion</span>
            <h2 id="home-video-title">A search that opens up as you go.</h2>
          </div>
          <div className="home-section-aside">
            <p>
              Show the experience you want employers to notice. Move through open
              roles without losing the thread, then step forward when a role feels
              like the right one.
            </p>
          </div>
        </div>
      </div>

      <div className="home-video-stage" ref={stageRef}>
        <div className="home-video-sticky">
          <div className="home-video-frame">
            <iframe
              ref={playerRef}
              src={src}
              title="Job search showreel"
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <button
              type="button"
              className="home-video-sound"
              aria-pressed={soundOn}
              onClick={toggleSound}
            >
              {soundOn ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 10v4h3.2L12 18.2V5.8L7.2 10H4z" />
                  <path d="M15.2 9.2a3.6 3.6 0 0 1 0 5.6M17.6 6.8a7 7 0 0 1 0 10.4" fill="none" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 10v4h3.2L12 18.2V5.8L7.2 10H4z" />
                  <path d="m16 10 4 4m0-4-4 4" fill="none" />
                </svg>
              )}
              <span>{soundOn ? "Sound on" : "Click for sound"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
