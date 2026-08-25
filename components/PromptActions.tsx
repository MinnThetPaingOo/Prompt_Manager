"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PromptActionsProps = {
  id: string;
  content: string;
};

export function PromptActions({ id, content }: PromptActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function deletePrompt() {
    const confirmed = window.confirm("Delete this prompt?");

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    router.push("/prompts");
    router.refresh();
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={copyPrompt}
        title="Copy prompt to clipboard"
        className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
          copied
            ? "border-teal-300 bg-teal-50 text-teal-700"
            : "border-slate-300 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
        }`}
      >
        {copied ? (
          <>
            {/* Checkmark icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            {/* Copy icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </>
        )}
      </button>
      <Link
        href={`/prompts/${id}/edit`}
        className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={deletePrompt}
        disabled={deleting}
        className="rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-70"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
