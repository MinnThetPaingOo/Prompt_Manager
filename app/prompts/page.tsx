"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppNav } from "@/components/AppNav";
import type { PromptLanguage, PromptRecord } from "@/types/prompt";

type LanguageFilter = PromptLanguage | "all";

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault(); // prevent navigating to detail page
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy prompt"
      className={`flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-all duration-200 ${
        copied
          ? "border-teal-300 bg-teal-50 text-teal-700"
          : "border-slate-200 bg-white text-slate-500 hover:border-teal-300 hover:text-teal-700"
      }`}
    >
      {copied ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
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
          Copied
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
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
  );
}

function CopyRandomButton({ prompts }: { prompts: PromptRecord[] }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyRandom() {
    if (prompts.length === 0) return;
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    try {
      await navigator.clipboard.writeText(random.content);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = random.content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopyRandom}
      disabled={prompts.length === 0}
      title="Copy a random prompt"
      className={`flex items-center gap-2 rounded-md border px-4 py-2 font-semibold transition-all duration-200 ${
        copied
          ? "border-teal-400 bg-teal-50 text-teal-700"
          : "border-slate-300 bg-white text-slate-700 hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
      }`}
    >
      {copied ? (
        <>
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
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
          </svg>
          Copy Random
        </>
      )}
    </button>
  );
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptRecord[]>([]);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<LanguageFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrompts() {
      const response = await fetch("/api/prompts");

      if (response.ok) {
        const data = await response.json();
        setPrompts(data.prompts);
      }

      setLoading(false);
    }

    loadPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesLanguage = language === "all" || prompt.language === language;
      const searchTarget = `${prompt.title} ${prompt.content}`.toLowerCase();
      const matchesQuery = searchTarget.includes(query.toLowerCase().trim());

      return matchesLanguage && matchesQuery;
    });
  }, [language, prompts, query]);

  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Prompts</h1>
            <p className="mt-2 text-slate-600">
              Browse, search, and filter your saved prompts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CopyRandomButton prompts={prompts} />
            <Link
              href="/prompts/create"
              className="rounded-md bg-teal-600 px-4 py-2 text-center font-semibold text-white hover:bg-teal-700"
            >
              Create Prompt
            </Link>
          </div>
        </div>

        {/* Filters */}
        <section className="mb-5 grid gap-3 sm:grid-cols-[1fr_180px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search prompts"
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-teal-600"
          />
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as LanguageFilter)}
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-teal-600"
          >
            <option value="all">All languages</option>
            <option value="english">English</option>
            <option value="burmese">Burmese</option>
          </select>
        </section>

        {/* Prompt cards */}
        <section className="grid gap-3">
          {filteredPrompts.map((prompt, index) => (
            <div key={prompt._id} className="relative">
              <Link
                href={`/prompts/${prompt._id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-300 transition-colors duration-150"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pr-20 sm:pr-24">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <h2 className="font-semibold text-slate-950">{prompt.title}</h2>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-700">
                    {prompt.language}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                  {prompt.content}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Updated {new Date(prompt.updatedAt).toLocaleString()}
                </p>
              </Link>
              {/* Copy button — absolutely positioned so it doesn't block the link */}
              <div className="absolute right-3 top-3">
                <CopyButton content={prompt.content} />
              </div>
            </div>
          ))}

          {!loading && filteredPrompts.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
              No prompts found.
            </p>
          )}
          {loading && (
            <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-500">
              Loading prompts...
            </p>
          )}
        </section>
      </main>
    </>
  );
}
