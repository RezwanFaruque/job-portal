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
    description: "Two-column layout with a skills sidebar — clean and contemporary.",
    badge: "Popular",
    featured: true,
  },
  {
    id: "classic",
    name: "Classic",
    description: "ATS-friendly single column with traditional serif typography.",
    badge: "ATS Ready",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Single-column resume with crisp hierarchy and open spacing.",
    badge: "Clean",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Formal header band and structured sections for senior roles.",
    badge: "Senior",
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

const HEADER_CONTACT_FIELDS = [
  { key: "email", title: "Email", placeholder: "Email address", match: /email/i },
  { key: "phone", title: "Phone", placeholder: "Phone number", match: /phone|mobile|tel/i },
  { key: "location", title: "Location", placeholder: "City, Country", match: /location|address|city/i },
  { key: "linkedin", title: "LinkedIn", placeholder: "LinkedIn / Website", match: /linkedin|website|portfolio|url/i },
] as const;

function findSectionByMatch(
  sections: ResumeSection[],
  match: RegExp,
  preferredKey?: string
): ResumeSection | undefined {
  return (
    sections.find((section) => preferredKey && section.key === preferredKey) ??
    sections.find((section) => match.test(`${section.key} ${section.title}`))
  );
}

function getResumeName(sections: ResumeSection[]): string {
  const nameSection = findSectionByMatch(sections, /^(full[\s_-]*)?name$/i, "name");
  const value = nameSection ? getSectionText(nameSection).trim() : "";
  return value || "Your Name";
}

function getHeaderContactValue(sections: ResumeSection[], fieldKey: string): string {
  const field = HEADER_CONTACT_FIELDS.find((item) => item.key === fieldKey);
  if (!field) return "";
  const section = findSectionByMatch(sections, field.match, field.key);
  return section ? getSectionText(section).trim() : "";
}

function upsertSection(
  sections: ResumeSection[],
  key: string,
  title: string,
  content: string
): ResumeSection[] {
  const existing = sections.find(
    (section) =>
      section.key === key ||
      new RegExp(`^${title}$`, "i").test(section.title.trim()) ||
      (key === "name" && isNameSection(section)) ||
      HEADER_CONTACT_FIELDS.some(
        (field) =>
          field.key === key && field.match.test(`${section.key} ${section.title}`)
      )
  );

  if (existing) {
    return sections.map((section) =>
      section.key === existing.key ? { ...section, content } : section
    );
  }

  const maxOrder = sections.reduce(
    (highest, section) => Math.max(highest, section.order),
    -1
  );

  return [
    ...sections,
    {
      key,
      title,
      content,
      order: key === "name" ? -10 : maxOrder + 1,
    },
  ].sort((left, right) => left.order - right.order);
}

function ensureHeaderSections(sections: ResumeSection[]): ResumeSection[] {
  let next = [...sections];

  if (!findSectionByMatch(next, /^(full[\s_-]*)?name$/i, "name")) {
    next = upsertSection(next, "name", "Name", "");
  }

  HEADER_CONTACT_FIELDS.forEach((field) => {
    if (!findSectionByMatch(next, field.match, field.key)) {
      next = upsertSection(next, field.key, field.title, "");
    }
  });

  return next;
}

function isExperienceHeadline(line: string): boolean {
  return /\b(19|20)\d{2}\b/.test(line) && line.length < 140;
}

function isBulletLine(line: string): boolean {
  return /^[•●▪*-]\s*/.test(line);
}

function isNameSection(section: ResumeSection): boolean {
  return /^(full[\s_-]*)?name$/i.test(section.title.trim()) ||
    /^name$/i.test(section.key.trim());
}

function isContactSection(section: ResumeSection): boolean {
  return /email|phone|linkedin|website|contact|address|location/i.test(
    `${section.key} ${section.title}`
  );
}

function isSkillsSection(section: ResumeSection): boolean {
  return /skills|competenc|expertise|technologies|tools/i.test(
    `${section.key} ${section.title}`
  );
}

function isSidebarSection(section: ResumeSection): boolean {
  return isSkillsSection(section) ||
    /education|certificat|language|interest|award|project/i.test(
      `${section.key} ${section.title}`
    );
}

function getBodySections(sections: ResumeSection[]): ResumeSection[] {
  return sections.filter(
    (section) => !isNameSection(section) && !isContactSection(section)
  );
}

function getSkillItems(content: string | string[]): string[] {
  const text = Array.isArray(content) ? content.join(", ") : content;
  return text
    .split(/[\n,|•●▪*-]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function isSkillCategoryStart(item: string): boolean {
  return /^[A-Za-z][A-Za-z0-9 &/+.-]{0,40}:\s*\S*/.test(item.trim());
}

/** Rebuild "Category: a, b, c" lines when skills were flattened into separate items. */
function regroupSkillFragments(items: string[]): string[] {
  const groups: string[] = [];
  let current = "";

  items.forEach((raw) => {
    const item = raw.trim();
    if (!item) return;

    if (isSkillCategoryStart(item)) {
      // Fix broken labels like "DevOps &" + "Cloud: Git"
      if (current && !current.includes(":") && /[&-]\s*$/.test(current)) {
        current = `${current} ${item}`;
        return;
      }
      if (current) groups.push(current);
      current = item;
      return;
    }

    if (current) {
      current = `${current}, ${item}`;
      return;
    }

    current = item;
  });

  if (current) groups.push(current);
  return groups;
}

function splitSkillCategories(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Split only before bullet/pipe markers that introduce a new "Category:" group
  const byBullet = trimmed
    .split(/\s*[•●▪*|]\s*(?=[A-Za-z][A-Za-z0-9 &/+.-]{0,40}:\s*)/)
    .map((part) => part.replace(/^[,|\s]+|[,|\s]+$/g, "").trim())
    .filter(Boolean);

  if (byBullet.length > 1) return byBullet;

  // Already one category line, or plain skill list
  if (isSkillCategoryStart(trimmed) || !trimmed.includes(":")) {
    return [trimmed];
  }

  // Fallback: split before a new category label after a comma
  const byCommaCategory = trimmed
    .split(/\s*,\s*(?=[A-Za-z][A-Za-z0-9 &/+.-]{0,40}:\s*)/)
    .map((part) => part.trim())
    .filter(Boolean);

  return byCommaCategory.length > 1 ? byCommaCategory : [trimmed];
}

function getSkillGroups(content: string | string[]): string[] {
  if (Array.isArray(content)) {
    const items = content.map((item) => item.trim()).filter(Boolean);
    if (items.length === 0) return [];

    const categoryStarts = items.filter(isSkillCategoryStart).length;
    if (categoryStarts >= 1 && items.length > categoryStarts) {
      return regroupSkillFragments(items);
    }

    if (categoryStarts === items.length) {
      return items;
    }

    return splitSkillCategories(items.join(", "));
  }

  const text = content.trim();
  if (!text) return [];

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    const categoryStarts = lines.filter(isSkillCategoryStart).length;
    if (categoryStarts >= 1 && lines.length > categoryStarts) {
      return regroupSkillFragments(lines);
    }
    if (categoryStarts === lines.length) {
      return lines;
    }
  }

  return splitSkillCategories(text);
}

function hasSkillCategories(groups: string[]): boolean {
  return groups.some((group) => isSkillCategoryStart(group));
}

function getHeadlineParts(line: string): { left: string; right: string } | null {
  const separators = [" | ", " — ", " – ", " - "];
  for (const separator of separators) {
    const index = line.lastIndexOf(separator);
    if (index > 0) {
      const left = line.slice(0, index).trim();
      const right = line.slice(index + separator.length).trim();
      if (left && right && (/\b(19|20)\d{2}\b/.test(right) || /present|current/i.test(right))) {
        return { left, right };
      }
    }
  }
  return null;
}

function TemplateThumbnail({ template }: { template: ResumeTemplate }) {
  return (
    <span
      className={`build-resume-thumbnail build-resume-thumbnail--${template}`}
      aria-hidden="true"
    >
      {template === "modern" ? (
        <>
          <span className="thumbnail-banner" />
          <span className="thumbnail-columns">
            <span className="thumbnail-sidebar">
              <span className="thumbnail-heading" />
              <span className="thumbnail-line short" />
              <span className="thumbnail-line short" />
              <span className="thumbnail-heading" />
              <span className="thumbnail-line short" />
            </span>
            <span className="thumbnail-main">
              <span className="thumbnail-name" />
              <span className="thumbnail-line" />
              <span className="thumbnail-heading" />
              <span className="thumbnail-line" />
              <span className="thumbnail-line short" />
            </span>
          </span>
        </>
      ) : (
        <>
          <span className="thumbnail-name" />
          <span className="thumbnail-line" />
          <span className="thumbnail-heading" />
          <span className="thumbnail-line" />
          <span className="thumbnail-line short" />
          <span className="thumbnail-heading" />
          <span className="thumbnail-line" />
          <span className="thumbnail-line short" />
        </>
      )}
    </span>
  );
}

function ResumeSectionContent({ section }: { section: ResumeSection }) {
  if (isSkillsSection(section)) {
    const skillGroups = getSkillGroups(section.content);

    if (skillGroups.length === 0) {
      return <p className="empty-section">Add details to this section.</p>;
    }

    if (hasSkillCategories(skillGroups)) {
      return (
        <div className="build-resume-skill-groups">
          {skillGroups.map((group, index) => (
            <p className="build-resume-skill-line" key={`${section.key}-${index}`}>
              {group}
            </p>
          ))}
        </div>
      );
    }

    const skills = getSkillItems(section.content);
    return (
      <div className="build-resume-skill-list">
        {skills.map((skill, index) => (
          <span className="build-resume-skill" key={`${section.key}-${index}`}>
            {skill}
          </span>
        ))}
      </div>
    );
  }

  if (Array.isArray(section.content)) {
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
      {lines.map((line, index) => {
        if (isBulletLine(line)) {
          return (
            <p className="build-resume-content-bullet" key={`${section.key}-${index}`}>
              {line.replace(/^[•●▪*-]\s*/, "")}
            </p>
          );
        }

        if (isExperienceHeadline(line)) {
          const parts = getHeadlineParts(line);
          if (parts) {
            return (
              <div
                className="build-resume-experience-headline split"
                key={`${section.key}-${index}`}
              >
                <span className="headline-left">{parts.left}</span>
                <span className="headline-right">{parts.right}</span>
              </div>
            );
          }

          return (
            <p
              className="build-resume-experience-headline"
              key={`${section.key}-${index}`}
            >
              {line}
            </p>
          );
        }

        return (
          <p className="build-resume-content-detail" key={`${section.key}-${index}`}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

function EditableSection({
  section,
  onSectionBlur,
}: {
  section: ResumeSection;
  onSectionBlur: (key: string, element: HTMLDivElement) => void;
}) {
  return (
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
        onBlur={(event) => onSectionBlur(section.key, event.currentTarget)}
      >
        <ResumeSectionContent section={section} />
      </div>
    </section>
  );
}

function ResumePreview({
  sections,
  template,
  onSectionBlur,
  onHeaderFieldBlur,
}: {
  sections: ResumeSection[];
  template: ResumeTemplate;
  onSectionBlur: (key: string, element: HTMLDivElement) => void;
  onHeaderFieldBlur: (key: string, title: string, value: string) => void;
}) {
  const name = getResumeName(sections);
  const bodySections = getBodySections(sections);
  const isModern = template === "modern";
  const sidebarSections = isModern
    ? bodySections.filter(isSidebarSection)
    : [];
  const mainSections = isModern
    ? bodySections.filter((section) => !isSidebarSection(section))
    : bodySections;

  return (
    <article
      className={`build-resume-paper build-resume-paper--${template}`}
      aria-label={`${TEMPLATES.find((item) => item.id === template)?.name} resume preview`}
    >
      <header className="build-resume-paper-header">
        <div className="build-resume-header-inner">
          <h2
            className="build-resume-editable-name"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Edit your name"
            spellCheck
            data-placeholder="Your Name"
            onBlur={(event) =>
              onHeaderFieldBlur(
                "name",
                "Name",
                event.currentTarget.innerText.trim() || "Your Name"
              )
            }
          >
            {name}
          </h2>
          {template === "executive" && (
            <p className="build-resume-header-tagline">Professional Resume</p>
          )}
          <div className="build-resume-contact">
            {HEADER_CONTACT_FIELDS.map((field, index) => {
              const value = getHeaderContactValue(sections, field.key);
              return (
                <span className="build-resume-contact-group" key={field.key}>
                  <span
                    className={`build-resume-contact-item${value ? "" : " is-empty"}`}
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-label={`Edit ${field.title}`}
                    spellCheck={false}
                    data-placeholder={field.placeholder}
                    onBlur={(event) =>
                      onHeaderFieldBlur(
                        field.key,
                        field.title,
                        event.currentTarget.innerText.trim()
                      )
                    }
                  >
                    {value}
                  </span>
                  {index < HEADER_CONTACT_FIELDS.length - 1 && (
                    <span className="build-resume-contact-sep" aria-hidden="true">
                      •
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </header>

      {bodySections.length === 0 ? (
        <p className="build-resume-empty-preview">
          Your resume sections will appear here.
        </p>
      ) : isModern ? (
        <div className="build-resume-paper-layout">
          <aside className="build-resume-paper-sidebar">
            {sidebarSections.map((section) => (
              <EditableSection
                key={section.key}
                section={section}
                onSectionBlur={onSectionBlur}
              />
            ))}
          </aside>
          <div className="build-resume-paper-main">
            {mainSections.map((section) => (
              <EditableSection
                key={section.key}
                section={section}
                onSectionBlur={onSectionBlur}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="build-resume-paper-sections">
          {bodySections.map((section) => (
            <EditableSection
              key={section.key}
              section={section}
              onSectionBlur={onSectionBlur}
            />
          ))}
        </div>
      )}
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
          if (nextResume) {
            const withHeader = {
              ...nextResume,
              sections: ensureHeaderSections(nextResume.sections),
            };
            setResume(withHeader);
            originalSections.current = withHeader.sections;
          } else {
            setResume(null);
            originalSections.current = null;
          }
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

  function handleHeaderFieldBlur(key: string, title: string, value: string) {
    setResume((current) =>
      current
        ? {
            ...current,
            sections: upsertSection(current.sections, key, title, value),
          }
        : current
    );
    setHasPreviewEdits(true);
  }

  function handleSectionBlur(key: string, element: HTMLDivElement) {
    const skillLines = Array.from(
      element.querySelectorAll(".build-resume-skill-line")
    );
    const skillItems = Array.from(
      element.querySelectorAll(".build-resume-skill")
    );
    const listItems = Array.from(element.querySelectorAll("li"));
    const editableLines = skillLines.length > 0
      ? skillLines.map((item) => item.textContent?.trim() ?? "").filter(Boolean)
      : skillItems.length > 0
      ? skillItems.map((item) => item.textContent?.trim() ?? "").filter(Boolean)
      : listItems.length > 0
      ? listItems.map((item) => `- ${item.innerText.trim()}`).filter(Boolean)
      : Array.from(element.children)
          .flatMap((child) => {
            if (child.classList.contains("build-resume-experience-headline") &&
              child.classList.contains("split")) {
              const left = child.querySelector(".headline-left")?.textContent?.trim() ?? "";
              const right = child.querySelector(".headline-right")?.textContent?.trim() ?? "";
              return [right ? `${left} | ${right}` : left];
            }

            if (child.tagName === "P" || child.classList.contains("build-resume-experience-headline")) {
              return [
                `${
                  child.classList.contains("build-resume-content-bullet")
                    ? "- "
                    : ""
                }${child.textContent?.trim() ?? ""}`,
              ];
            }

            return (child.textContent ?? "").split(/\r?\n/);
          })
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
                      ? skillLines.length > 0 || hasSkillCategories(getSkillGroups(value))
                        ? getSkillGroups(value)
                        : getSkillItems(value)
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

  function handleSaveAsPdf() {
    const previousPreviewMode = isPreviewMode;
    setIsPreviewMode(true);
    document.body.classList.add("is-printing-resume");

    window.setTimeout(() => {
      window.print();
      document.body.classList.remove("is-printing-resume");
      setIsPreviewMode(previousPreviewMode);
    }, 150);
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
                <button type="button" onClick={handleSaveAsPdf}>
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
                Click your name, contact fields, or any section text to edit.
                Changes apply to this preview and downloaded PDF only, not your
                saved resume.
              </span>
            </div>
            <div className="build-resume-preview-canvas">
              <ResumePreview
                sections={resume.sections}
                template={selectedTemplate}
                onSectionBlur={handleSectionBlur}
                onHeaderFieldBlur={handleHeaderFieldBlur}
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
