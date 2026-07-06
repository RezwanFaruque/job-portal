"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface JobDescriptionEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type ToolbarItem =
  | { type: "divider" }
  | { type: "command"; command: string; label: string; title: string; className?: string }
  | { type: "format"; tag: string; label: string; title: string; className?: string }
  | { type: "link"; label: string; title: string }
  | { type: "heading-select" };

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { type: "command", command: "undo", label: "↶", title: "Undo" },
  { type: "command", command: "redo", label: "↷", title: "Redo" },
  { type: "divider" },
  { type: "heading-select" },
  { type: "divider" },
  { type: "command", command: "bold", label: "B", title: "Bold", className: "bold" },
  { type: "command", command: "italic", label: "I", title: "Italic", className: "italic" },
  { type: "command", command: "underline", label: "U", title: "Underline", className: "underline" },
  { type: "command", command: "strikeThrough", label: "S", title: "Strikethrough", className: "strike" },
  { type: "divider" },
  { type: "command", command: "insertUnorderedList", label: "• List", title: "Bullet list" },
  { type: "command", command: "insertOrderedList", label: "1. List", title: "Numbered list" },
  { type: "command", command: "indent", label: "→", title: "Increase indent" },
  { type: "command", command: "outdent", label: "←", title: "Decrease indent" },
  { type: "divider" },
  { type: "format", tag: "blockquote", label: "❝", title: "Block quote" },
  { type: "link", label: "🔗", title: "Insert link" },
  { type: "command", command: "insertHorizontalRule", label: "―", title: "Horizontal line" },
  { type: "divider" },
  { type: "command", command: "justifyLeft", label: "⫷", title: "Align left" },
  { type: "command", command: "justifyCenter", label: "≡", title: "Align center" },
  { type: "command", command: "justifyRight", label: "⫸", title: "Align right" },
  { type: "divider" },
  { type: "command", command: "removeFormat", label: "Clear", title: "Clear formatting" },
];

const HEADING_OPTIONS = [
  { value: "p", label: "Normal text" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
];

export function getEditorPlainText(html: string) {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

export default function JobDescriptionEditor({
  id,
  value,
  onChange,
  placeholder = "Describe responsibilities, requirements, and benefits...",
}: JobDescriptionEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const [activeCommands, setActiveCommands] = useState<Record<string, boolean>>({});
  const [headingValue, setHeadingValue] = useState("p");

  const syncValue = useCallback(() => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const updateActiveStates = useCallback(() => {
    const states: Record<string, boolean> = {};
    const commands = [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "insertUnorderedList",
      "insertOrderedList",
    ];

    for (const command of commands) {
      try {
        states[command] = document.queryCommandState(command);
      } catch {
        states[command] = false;
      }
    }

    setActiveCommands(states);
  }, []);

  function focusEditor() {
    editorRef.current?.focus();
  }

  function runCommand(command: string, valueArg?: string) {
    focusEditor();
    document.execCommand(command, false, valueArg);
    syncValue();
    updateActiveStates();
  }

  function applyFormatBlock(tag: string) {
    focusEditor();
    document.execCommand("formatBlock", false, `<${tag}>`);
    syncValue();
    updateActiveStates();
  }

  function insertLink() {
    focusEditor();
    const url = window.prompt("Enter link URL (include https://)");
    if (!url?.trim()) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      document.execCommand(
        "insertHTML",
        false,
        `<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">${url.trim()}</a>`
      );
    } else {
      document.execCommand("createLink", false, url.trim());
    }

    syncValue();
    updateActiveStates();
  }

  function handleHeadingChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const tag = event.target.value;
    setHeadingValue(tag);
    applyFormatBlock(tag);
  }

  useEffect(() => {
    if (!editorRef.current || isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="job-description-editor" id={id}>
      <div className="editor-toolbar" role="toolbar" aria-label="Formatting options">
        {TOOLBAR_ITEMS.map((item, index) => {
          if (item.type === "divider") {
            return <span key={`divider-${index}`} className="toolbar-divider" />;
          }

          if (item.type === "heading-select") {
            return (
              <select
                key="heading-select"
                className="toolbar-select"
                value={headingValue}
                title="Text style"
                aria-label="Text style"
                onChange={handleHeadingChange}
                onMouseDown={(event) => event.preventDefault()}
              >
                {HEADING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }

          if (item.type === "format") {
            return (
              <button
                key={item.tag}
                type="button"
                className={`toolbar-btn ${item.className ?? ""}`}
                title={item.title}
                aria-label={item.title}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applyFormatBlock(item.tag)}
              >
                {item.label}
              </button>
            );
          }

          if (item.type === "link") {
            return (
              <button
                key="insert-link"
                type="button"
                className="toolbar-btn"
                title={item.title}
                aria-label={item.title}
                onMouseDown={(event) => event.preventDefault()}
                onClick={insertLink}
              >
                {item.label}
              </button>
            );
          }

          const isActive = activeCommands[item.command];

          return (
            <button
              key={item.command}
              type="button"
              className={`toolbar-btn toolbar-btn-${item.command} ${item.className ?? ""} ${
                isActive ? "active" : ""
              }`}
              title={item.title}
              aria-label={item.title}
              aria-pressed={isActive}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand(item.command)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Job description"
        data-placeholder={placeholder}
        onInput={() => {
          syncValue();
          updateActiveStates();
        }}
        onBlur={syncValue}
        onKeyUp={updateActiveStates}
        onMouseUp={updateActiveStates}
        suppressContentEditableWarning
      />
    </div>
  );
}
