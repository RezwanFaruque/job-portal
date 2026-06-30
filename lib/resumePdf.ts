import type { TextItem } from "pdfjs-dist/types/src/display/api";

function groupTextItemsIntoLines(items: TextItem[]): string[] {
  const lines: string[] = [];
  let currentLine: string[] = [];
  let lastY: number | null = null;

  for (const item of items) {
    const text = item.str.trim();
    if (!text) continue;

    const y = item.transform[5];
    if (lastY !== null && Math.abs(y - lastY) > 4 && currentLine.length > 0) {
      lines.push(currentLine.join(" ").trim());
      currentLine = [];
    }

    currentLine.push(text);
    lastY = y;
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.join(" ").trim());
  }

  return lines;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const textItems = content.items.filter(
      (item): item is TextItem => "str" in item
    );
    const pageLines = groupTextItemsIntoLines(textItems);

    if (pageLines.length > 0) {
      pages.push(pageLines.join("\n"));
    }
  }

  return pages.join("\n\n");
}

export function createPdfPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokePdfPreviewUrl(url: string | null) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}
