import Link from "next/link";

const tools = [
  {
    number: "01",
    kicker: "Matches",
    title: "Suggestions picked for you",
    description: "Roles that line up with the direction you want next.",
    href: "/suggested-job",
    action: "Explore suggested jobs",
  },
  {
    number: "02",
    kicker: "Shortlist",
    title: "A list you can return to",
    description: "Save openings and compare them when you are ready.",
    href: "/save-for-later",
    action: "View saved jobs",
  },
  {
    number: "03",
    kicker: "Resume",
    title: "Your experience, kept close",
    description: "Review the story you share with every application.",
    href: "/view-resume",
    action: "Review your resume",
  },
  {
    number: "04",
    kicker: "Applications",
    title: "Every application, in view",
    description: "See where you have applied and what is still open.",
    href: "/applied-job",
    action: "View applications",
  },
];

export default function HomeJobToolkit() {
  return (
    <section className="home-job-toolkit" aria-labelledby="home-toolkit-title">
      <div className="home-toolkit-glow" aria-hidden="true" />
      <div className="container">
        <div className="home-toolkit-layout">
          <header className="home-toolkit-intro" data-home-reveal="from-left">
            <span className="home-section-eyebrow">Your search, in one place</span>
            <h2 id="home-toolkit-title">More focus for every step forward.</h2>
            <p>
              Keep suggestions, saved roles, your resume, and applications together
              so the search stays easy to pick up again.
            </p>
            <Link href="/browse-job" className="home-toolkit-cta">
              Explore opportunities <span aria-hidden="true">→</span>
            </Link>
          </header>

          <div className="home-toolkit-grid" data-home-reveal-stagger>
            {tools.map((tool) => (
              <Link className="home-toolkit-card" href={tool.href} key={tool.number}>
                <span className="home-toolkit-kicker">{tool.kicker}</span>
                <span className="home-toolkit-number">{tool.number}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <span className="home-toolkit-link">
                  {tool.action} <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
