export interface ResumeField {
  id: string;
  label: string;
  value: string;
  multiline: boolean;
}

const SECTION_DEFINITIONS = [
  { label: "Summary", keywords: ["summary", "professional summary", "objective", "profile", "about me", "about"] },
  { label: "Experience", keywords: ["experience", "work experience", "employment", "work history", "professional experience", "career history"] },
  { label: "Education", keywords: ["education", "academic background", "academic", "qualifications"] },
  { label: "Skills", keywords: ["skills", "technical skills", "core competencies", "key skills", "expertise"] },
  { label: "Certifications", keywords: ["certifications", "certificates", "licenses", "credentials"] },
  { label: "Projects", keywords: ["projects", "portfolio", "key projects"] },
  { label: "Languages", keywords: ["languages", "language proficiency"] },
  { label: "References", keywords: ["references", "referees"] },
  { label: "Achievements", keywords: ["achievements", "awards", "honors", "accomplishments"] },
] as const;

function slugify(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeLine(line: string) {
  return line.trim().replace(/\s+/g, " ");
}

function isSectionHeader(line: string): string | null {
  const cleaned = normalizeLine(line).replace(/:$/, "").toLowerCase();

  for (const section of SECTION_DEFINITIONS) {
    if (section.keywords.some((keyword) => cleaned === keyword || cleaned.startsWith(`${keyword} `))) {
      return section.label;
    }
  }

  if (/^[A-Z0-9][A-Z0-9\s/&-]{2,}$/.test(line.trim()) && line.trim().length <= 40) {
    return normalizeLine(line).replace(/:$/, "");
  }

  return null;
}

function extractContactFields(text: string): ResumeField[] {
  const fields: ResumeField[] = [];
  const lines = text.split(/\n+/).map(normalizeLine).filter(Boolean);

  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) {
    fields.push({ id: "email", label: "Email", value: emailMatch[0], multiline: false });
  }

  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/);
  if (phoneMatch) {
    fields.push({ id: "phone", label: "Phone", value: phoneMatch[0].trim(), multiline: false });
  }

  const linkedInMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+/i);
  if (linkedInMatch) {
    fields.push({ id: "linkedin", label: "LinkedIn", value: linkedInMatch[0], multiline: false });
  }

  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?!linkedin)[a-z0-9-]+\.[a-z]{2,}(?:\/[^\s]*)?/i);
  if (websiteMatch) {
    fields.push({ id: "website", label: "Website", value: websiteMatch[0], multiline: false });
  }

  const likelyName = lines.find((line) => line.length > 2 && line.length <= 50 && !line.includes("@"));
  if (likelyName) {
    fields.unshift({ id: "full-name", label: "Full Name", value: likelyName, multiline: false });
  }

  return fields;
}

function splitIntoSections(text: string): Map<string, string> {
  const lines = text.split(/\n+/);
  const sections = new Map<string, string>();
  let currentLabel: string | null = null;
  let currentContent: string[] = [];

  function flushSection() {
    if (!currentLabel) return;
    const value = currentContent.join("\n").trim();
    if (value) {
      sections.set(currentLabel, value);
    }
  }

  for (const rawLine of lines) {
    const line = normalizeLine(rawLine);
    if (!line) continue;

    const header = isSectionHeader(line);
    if (header) {
      flushSection();
      currentLabel = header;
      currentContent = [];
      continue;
    }

    if (currentLabel) {
      currentContent.push(line);
    }
  }

  flushSection();
  return sections;
}

export function parseResumeText(text: string): ResumeField[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [{ id: "resume-content", label: "Resume Content", value: "", multiline: true }];
  }

  const contactFields = extractContactFields(normalized);
  const usedIds = new Set(contactFields.map((field) => field.id));
  const sectionMap = splitIntoSections(normalized);
  const sectionFields: ResumeField[] = [];

  for (const [label, value] of sectionMap.entries()) {
    const id = slugify(label);
    if (usedIds.has(id)) continue;
    usedIds.add(id);
    sectionFields.push({ id, label, value, multiline: true });
  }

  if (sectionFields.length > 0) {
    return [...contactFields, ...sectionFields];
  }

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (paragraphs.length > 1) {
    return [
      ...contactFields,
      ...paragraphs.map((value, index) => ({
        id: `section-${index + 1}`,
        label: `Section ${index + 1}`,
        value,
        multiline: true,
      })),
    ];
  }

  return [
    ...contactFields,
    { id: "resume-content", label: "Resume Content", value: normalized, multiline: true },
  ];
}
