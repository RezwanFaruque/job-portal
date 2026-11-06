"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getResume } from "@/services/api";

interface ResumeSection {
  key: string;
  title: string;
  content: string | string[];
  order: number;
}

interface ResumeData {
  sections: ResumeSection[];
}

type ResumeTemplate = "modern" | "classic" | "minimal" | "executive";

const TEMPLATES: {
  id: ResumeTemplate;
  name: string;
  description: string;
  badge: string;
  featured?: boolean;
}[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Confident color, clear hierarchy, and refined details.",
    badge: "Popular",
    featured: true,
  },
  {
    id: "classic",
    name: "Classic",
    description: "Timeless typography with a polished, formal structure.",
    badge: "Premium",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Quietly confident design with generous white space.",
    badge: "Premium",
  },
  {
    id: "executive",
    name: "Executive",
    description: "An elevated, editorial look for your next big move.",
    badge: "Premium",
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeResume(value: unknown): ResumeData | null {
  if (value === null) return null;
  if (!isRecord(value)) throw new Error("The resume response is invalid.");

  let metadata = value;
  for (let depth = 0; depth < 3; depth += 1) {
    if (Array.isArray(metadata.sections)) break;
    if (metadata.success === false) {
      throw new Error(
        typeof metadata.message === "string"
          ? metadata.message
          : "Failed to load your resume."
      );
    }
    if (metadata.data === null || metadata.resume === null) return null;
    if (isRecord(metadata.data)) {
      metadata = metadata.data;
    } else if (isRecord(metadata.resume)) {
      metadata = metadata.resume;
    } else {
      break;
    }
  }

  if (metadata.success === false) {
    throw new Error(
      typeof metadata.message === "string"
        ? metadata.message
        : "Failed to load your resume."
    );
  }

  if (!Array.isArray(metadata.sections)) {
    throw new Error("The resume response did not include a sections list.");
  }

  const sections = metadata.sections.map((rawSection, index) => {
    if (!isRecord(rawSection)) {
      throw new Error("The resume response contains an invalid section.");
    }

    const key =
      typeof rawSection.key === "string"
        ? rawSection.key
        : `section-${index + 1}`;
    const title =
      typeof rawSection.title === "string" && rawSection.title.trim()
        ? rawSection.title
        : key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    const content = Array.isArray(rawSection.content)
      ? rawSection.content.filter(
          (item): item is string => typeof item === "string"
        )
      : typeof rawSection.content === "string"
        ? rawSection.content
        : "";

    return {
      key,
      title,
      content,
      order: typeof rawSection.order === "number" ? rawSection.order : index,
    };
  });

  return {
    sections: sections.sort((left, right) => left.order - right.order),
  };
}

function getSectionText(section: ResumeSection): string {
  return Array.isArray(section.content)
    ? section.content.join(", ")
    : section.content;
}

function getResumeName(sections: ResumeSection[]): string {
  const nameSection = sections.find((section) =>
    /^(full[\s_-]*)?name$/i.test(section.title.trim())
  );
  return nameSection ? getSectionText(nameSection).trim() : "Your Name";
}

function getContactDetails(sections: ResumeSection[]): string[] {
  return sections
    .filter((section) => /email|phone|linkedin|website|contact/i.test(section.title))
    .map(getSectionText)
    .filter((content) => content.trim().length > 0);
}

function isExperienceHeadline(line: string): boolean {
  return /\b(19|20)\d{2}\b/.test(line) && line.length < 140;
}

function isBulletLine(line: string): boolean {
  return /^[•●▪*-]\s*/.test(line);
}

function isSkillsSection(section: ResumeSection): boolean {
  return /skills|competenc|expertise/i.test(`${section.key} ${section.title}`);
}

function getSkillItems(content: string | string[]): string[] {
  const text = Array.isArray(content) ? content.join("\n") : content;
  return text
    .split(/[\n,]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function TemplateThumbnail({ template }: { template: ResumeTemplate }) {
  return (
    <span
      className={`build-resume-thumbnail build-resume-thumbnail--${template}`}
      aria-hidden="true"
    >
      <span className="thumbnail-name" />
      <span className="thumbnail-line" />
      <span className="thumbnail-heading" />
      <span className="thumbnail-line" />
      <span className="thumbnail-line short" />
      <span className="thumbnail-heading" />
      <span className="thumbnail-line" />
      <span className="thumbnail-line short" />
      {template === "executive" && <span className="thumbnail-line" />}
    </span>
  );
}

function ResumeSectionContent({ section }: { section: ResumeSection }) {
  if (Array.isArray(section.content)) {
    if (isSkillsSection(section)) {
      const skills = getSkillItems(section.content);
      return skills.length > 0 ? (
        <div className="build-resume-skill-list">
          {skills.map((skill, index) => (
            <span className="build-resume-skill" key={`${section.key}-${index}`}>
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="empty-section">Add details to this section.</p>
      );
    }

    return section.content.length > 0 ? (
      <ul>
        {section.content.map((item, index) => (
          <li key={`${section.key}-${index}`}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="empty-section">Add details to this section.</p>
    );
  }

  const lines = section.content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return (
      <p className={lines[0] ? "" : "empty-section"}>
        {lines[0] || "Add details to this section."}
      </p>
    );
  }

  return (
    <div className="build-resume-content-lines">
      {lines.map((line, index) =>
        isBulletLine(line) ? (
          <p className="build-resume-content-bullet" key={`${section.key}-${index}`}>
            {line.replace(/^[•●▪*-]\s*/, "")}
          </p>
        ) : isExperienceHeadline(line) ? (
          <p
            className="build-resume-experience-headline"
            key={`${section.key}-${index}`}
          >
            {line}
          </p>
        ) : (
          <p className="build-resume-content-detail" key={`${section.key}-${index}`}>
            {line}
          </p>
        )
      )}
    </div>
  );
}

function ResumePreview({
  sections,
  template,
  onSectionBlur,
}: {
  sections: ResumeSection[];
  template: ResumeTemplate;
  onSectionBlur: (key: string, element: HTMLDivElement) => void;
}) {
  const contactDetails = getContactDetails(sections);
  const name = getResumeName(sections);

  return (
    <article
      className={`build-resume-paper build-resume-paper--${template}`}
      aria-label={`${TEMPLATES.find((item) => item.id === template)?.name} resume preview`}
    >
      <header className="build-resume-paper-header">
        <h2>{name}</h2>
        {contactDetails.length > 0 && (
          <div className="build-resume-contact">
            {contactDetails.map((detail, index) => (
              <span key={`${detail}-${index}`}>{detail}</span>
            ))}
          </div>
        )}
      </header>

      <div className="build-resume-paper-sections">
        {sections.length === 0 ? (
          <p className="build-resume-empty-preview">
            Your resume sections will appear here.
          </p>
        ) : (
          sections.map((section) => (
            <section className="build-resume-paper-section" key={section.key}>
              <h3>{section.title}</h3>
              <div
                className="build-resume-editable-content"
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-label={`Edit ${section.title} in the resume preview`}
                aria-multiline="true"
                spellCheck
                onBlur={(event) =>
                  onSectionBlur(section.key, event.currentTarget)
                }
              >
                <ResumeSectionContent section={section} />
              </div>
            </section>
          ))
        )}
      </div>
    </article>
  );
}

export default function BuildResumeComponent() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumeTemplate>("modern");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPreviewEdits, setHasPreviewEdits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const originalSections = useRef<ResumeSection[] | null>(null);

  useEffect(() => {
    let active = true;

    getResume()
      .then((response) => {
        if (active) {
          const nextResume = normalizeResume(response);
          setResume(nextResume);
          originalSections.current = nextResume?.sections ?? null;
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load your resume."
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleSectionBlur(key: string, element: HTMLDivElement) {
    const skillItems = Array.from(
      element.querySelectorAll(".build-resume-skill")
    );
    const listItems = Array.from(element.querySelectorAll("li"));
    const editableLines = skillItems.length > 0
      ? skillItems.map((item) => item.textContent?.trim() ?? "").filter(Boolean)
      : listItems.length > 0
      ? listItems.map((item) => `- ${item.innerText.trim()}`).filter(Boolean)
      : Array.from(element.children)
          .flatMap((child) =>
            child.tagName === "P"
              ? [
                  `${
                    child.classList.contains("build-resume-content-bullet")
                      ? "- "
                      : ""
                  }${child.textContent?.trim() ?? ""}`,
                ]
              : (child.textContent ?? "").split(/\r?\n/)
          )
          .map((line) => line.trim())
          .filter(Boolean);
    const value = editableLines.length > 0
      ? editableLines.join("\n")
      : element.innerText.trim();

    setResume((current) =>
      current
        ? {
            ...current,
            sections: current.sections.map((section) =>
              section.key === key
                ? {
                    ...section,
                    content: isSkillsSection(section)
                      ? getSkillItems(value)
                      : value,
                  }
                : section
            ),
          }
        : current
    );
    setHasPreviewEdits(true);
  }

  function handleResetPreview() {
    if (!originalSections.current) return;
    setResume((current) =>
      current ? { ...current, sections: originalSections.current ?? [] } : current
    );
    setHasPreviewEdits(false);
  }

  return (
    <main id="build_resume" aria-labelledby="build-resume-title">
      <header className="build-resume-page-header">
        <div>
          <span className="build-resume-eyebrow">Career studio · Premium templates</span>
          <h1 id="build-resume-title">Build your resume</h1>
          <p>
            Turn your experience into a polished, professional resume that feels
            unmistakably yours.
          </p>
        </div>
        <Link className="build-resume-upload-link" href="/upload-resume">
          Manage resume sections
        </Link>
      </header>

      {isLoading ? (
        <div className="build-resume-state" role="status">
          Loading your saved resume...
        </div>
      ) : error ? (
        <div className="build-resume-state build-resume-error" role="alert">
          {error}
        </div>
      ) : !resume ? (
        <div className="build-resume-state">
          <h2>Start with your resume details</h2>
          <p>Upload a resume first so we can use its sections in your templates.</p>
          <Link href="/upload-resume">Upload a resume</Link>
        </div>
      ) : (
        <div className={`build-resume-workspace ${isPreviewMode ? "preview-mode" : ""}`}>
          {!isPreviewMode && (
            <section
              className="build-resume-template-picker"
              aria-labelledby="template-picker-title"
            >
              <div className="build-resume-section-heading">
                <div>
                  <h2 id="template-picker-title">Choose a template</h2>
                  <p>Thoughtful designs for your next career move.</p>
                </div>
                <span className="build-resume-template-count">
                  {TEMPLATES.length} designs
                </span>
              </div>

              <div className="build-resume-template-list">
                {TEMPLATES.map((template) => (
                  <button
                    type="button"
                    key={template.id}
                    className={`build-resume-template-option ${
                      selectedTemplate === template.id ? "selected" : ""
                    }`}
                    aria-pressed={selectedTemplate === template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <TemplateThumbnail template={template.id} />
                    <span className="build-resume-template-copy">
                      <strong>{template.name}</strong>
                      <span>{template.description}</span>
                    </span>
                    <span
                      className={`build-resume-template-badge ${
                        template.featured ? "featured" : ""
                      }`}
                    >
                      {template.badge}
                    </span>
                    <span className="build-resume-template-check" aria-hidden="true">
                      ✓
                    </span>
                  </button>
                ))}
              </div>
              <div className="build-resume-premium-note">
                <span className="premium-note-icon" aria-hidden="true">
                  ✦
                </span>
                <div>
                  <strong>Made for your next big opportunity</strong>
                  <span>
                    Premium layouts, a considered finish, and a preview you can
                    print or save as PDF.
                  </span>
                </div>
              </div>
            </section>
          )}

          <section
            className="build-resume-preview-area"
            aria-labelledby="resume-preview-title"
          >
            <div className="build-resume-preview-toolbar">
              <div>
                <h2 id="resume-preview-title">
                  {isPreviewMode ? "Final preview" : "Live preview"}
                </h2>
                <p>
                  {TEMPLATES.find((item) => item.id === selectedTemplate)?.name} template
                </p>
              </div>
              <div className="build-resume-preview-actions">
                {hasPreviewEdits && (
                  <button type="button" onClick={handleResetPreview}>
                    Reset preview
                  </button>
                )}
                <button type="button" onClick={() => window.print()}>
                  <span aria-hidden="true">↓</span> Save as PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewMode((current) => !current)}
                >
                  {isPreviewMode ? "Back to templates" : "Preview full resume"}
                </button>
              </div>
            </div>
            <div className="build-resume-preview-hint">
              <span className="build-resume-preview-hint-icon" aria-hidden="true">
                i
              </span>
              <span>
                <strong>Quick tip</strong>
                Click section text to edit it. Changes apply to this preview and
                downloaded PDF only, not your saved resume.
              </span>
            </div>
            <div className="build-resume-preview-canvas">
              <ResumePreview
                sections={resume.sections}
                template={selectedTemplate}
                onSectionBlur={handleSectionBlur}
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
