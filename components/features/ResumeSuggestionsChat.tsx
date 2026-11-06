"use client";

import React, { useRef, useState } from "react";
import type { ResumeField } from "@/lib/parseResumeText";

interface ResumeSuggestionsChatProps {
  fields: ResumeField[];
  onApplySuggestion: (id: string, value: string) => void;
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  fieldId?: string;
}

const STARTER_PROMPTS = [
  "Make this section more compelling",
  "Add measurable impact",
  "Improve clarity and wording",
];

function getSampleSuggestion(field: ResumeField): string {
  const label = field.label.toLowerCase();

  if (label.includes("summary") || label.includes("objective")) {
    return "Results-driven [your job title] with [X years] of experience in [your area of expertise]. Skilled in [key skill] and [key skill], with a track record of [specific achievement]. Known for combining thoughtful problem-solving with measurable results.";
  }

  if (label.includes("skill")) {
    return "Add your most relevant skills, grouped by type. For example: Technical - [tool or technology], [tool or technology]; Leadership - [strength], [strength]. Keep the list focused on the role you want.";
  }

  if (label.includes("experience") || label.includes("employment")) {
    return "- Led [project or responsibility] to achieve [measurable result].\n- Improved [process or outcome] by [specific amount] through [action you took].\n- Collaborated with [team or stakeholders] to deliver [impact].";
  }

  return "Start with a clear action, explain the value of your work, and add a concrete result. For example: [Action you took] to [measurable outcome] by [specific amount or impact]. Replace the placeholders with details from your experience.";
}

export default function ResumeSuggestionsChat({
  fields,
  onApplySuggestion,
}: ResumeSuggestionsChatProps) {
  const availableFields = fields.filter((field) => field.id !== "file-name");
  const [selectedFieldId, setSelectedFieldId] = useState(
    availableFields[0]?.id ?? ""
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const nextMessageId = useRef(0);
  const activeFieldId = availableFields.some(
    (field) => field.id === selectedFieldId
  )
    ? selectedFieldId
    : availableFields[0]?.id ?? "";

  function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = message.trim();
    const selectedField = availableFields.find(
      (field) => field.id === activeFieldId
    );

    if (!prompt || !selectedField) return;

    const messageId = nextMessageId.current;
    nextMessageId.current += 2;
    setMessages((current) => [
      ...current,
      { id: messageId, role: "user", content: prompt },
      {
        id: messageId + 1,
        role: "assistant",
        content: getSampleSuggestion(selectedField),
        fieldId: selectedField.id,
      },
    ]);
    setMessage("");
  }

  return (
    <div className="resume-assistant-widget">
      {isOpen && (
        <aside
          className="resume-suggestions-chat"
          aria-label="Resume suggestions chat"
        >
          <div className="resume-chat-heading">
            <div className="resume-chat-sparkle" aria-hidden="true">
              AI
            </div>
            <div className="resume-chat-heading-copy">
              <div className="resume-chat-title">Resume writing assistant</div>
              <div className="resume-chat-subtitle">
                Get ideas to make your sections stand out
              </div>
            </div>
            <button
              type="button"
              className="resume-chat-close"
              aria-label="Close resume writing assistant"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="resume-chat-demo-note">
            UI preview | Sample suggestions only; AI is not connected yet.
          </div>

          <label className="resume-chat-field-label" htmlFor="resume-chat-section">
            Working on
          </label>
          <select
            id="resume-chat-section"
            className="resume-chat-section-select"
            value={activeFieldId}
            onChange={(event) => setSelectedFieldId(event.target.value)}
            disabled={availableFields.length === 0}
          >
            {availableFields.length === 0 ? (
              <option value="">Upload a resume to get started</option>
            ) : (
              availableFields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))
            )}
          </select>

          <div className="resume-chat-messages" aria-live="polite">
            {messages.length === 0 ? (
              <div className="resume-chat-welcome">
                <span className="resume-chat-avatar" aria-hidden="true">
                  AI
                </span>
                <p>
                  Hi! I can help you shape a strong first draft. Choose a
                  section and tell me what you would like to improve.
                </p>
              </div>
            ) : (
              messages.map((chatMessage) => (
                <div
                  key={chatMessage.id}
                  className={`resume-chat-message ${chatMessage.role}`}
                >
                  <p>{chatMessage.content}</p>
                  {chatMessage.role === "assistant" && chatMessage.fieldId && (
                    <button
                      type="button"
                      className="resume-chat-apply"
                      onClick={() => {
                        if (chatMessage.fieldId) {
                          onApplySuggestion(
                            chatMessage.fieldId,
                            chatMessage.content
                          );
                        }
                      }}
                    >
                      Use this suggestion
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="resume-chat-prompts" aria-label="Suggested prompts">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setMessage(prompt)}
                disabled={availableFields.length === 0}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="resume-chat-compose" onSubmit={handleSend}>
            <label className="visually-hidden" htmlFor="resume-chat-message">
              Ask for a resume suggestion
            </label>
            <textarea
              id="resume-chat-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask for help with this section..."
              rows={2}
              disabled={availableFields.length === 0}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!message.trim() || availableFields.length === 0}
            >
              <svg
                viewBox="0 0 20 20"
                width="18"
                height="18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 10 17 3l-4.5 14-2.7-5.3L3 10Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="m9.8 11.7 3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>
        </aside>
      )}
      <button
        type="button"
        className="resume-assistant-launcher"
        aria-label={
          isOpen
            ? "Close resume writing assistant"
            : "Open resume writing assistant"
        }
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? (
          <span className="resume-assistant-launcher-close" aria-hidden="true">
            ×
          </span>
        ) : (
          <>
            <span className="resume-assistant-launcher-icon" aria-hidden="true">
              AI
            </span>
            <span>Resume help</span>
          </>
        )}
      </button>
    </div>
  );
}
