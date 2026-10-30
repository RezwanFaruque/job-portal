import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Suggestions picked for you",
    description: "See roles that connect with your interests and career direction.",
    href: "/suggested-job",
    action: "Explore suggested jobs",
  },
  {
    number: "02",
    title: "A shortlist you can return to",
    description: "Save interesting openings and compare them when you are ready.",
    href: "/save-for-later",
    action: "View saved jobs",
  },
  {
    number: "03",
    title: "Your experience, in one place",
    description: "Keep your resume ready to review and share with your next application.",
    href: "/view-resume",
    action: "Review your resume",
  },
  {
    number: "04",
    title: "Applications at a glance",
    description: "Revisit the roles you have applied to and keep track of your search.",
    href: "/applied-job",
    action: "View applications",
  },
];

export default function HomeJobToolkit() {
  return (
    <section className="home-job-toolkit" aria-labelledby="home-toolkit-title">
      <div className="container">
        <div className="home-toolkit-layout">
          <header className="home-toolkit-intro" data-home-reveal="from-left">
            <span className="home-section-eyebrow">Your search, in one place</span>
            <h2 id="home-toolkit-title">More focus for every step forward.</h2>
            <p>
              Organize your search around the tools you already need—from
              exploring new roles to keeping your applications close.
            </p>
            <Link href="/browse-job" className="home-toolkit-cta">
              Explore opportunities <span aria-hidden="true">→</span>
            </Link>
          </header>

          <div className="home-toolkit-grid" data-home-reveal-stagger>
            {tools.map((tool) => (
              <Link className="home-toolkit-card" href={tool.href} key={tool.number}>
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
