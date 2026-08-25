"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { PromptActions } from "@/components/PromptActions";
import type { PromptRecord } from "@/types/prompt";

export default function PromptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [prompt, setPrompt] = useState<PromptRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrompt() {
      const response = await fetch(`/api/prompts/${params.id}`);

      if (response.status === 404) {
        router.push("/prompts");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setPrompt(data.prompt);
      }

      setLoading(false);
    }

    loadPrompt();
  }, [params.id, router]);

  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/prompts"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to prompts
        </Link>

        <article className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading && (
            <div className="p-6">
              <div className="h-6 w-32 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-100" />
              <div className="mt-6 h-40 animate-pulse rounded bg-slate-100" />
            </div>
          )}

          {prompt && (
            <>
              {/* Header */}
              <div className="border-b border-slate-100 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-600">
                      {prompt.language}
                    </span>
                    <h1 className="mt-2 break-words text-2xl font-semibold text-slate-950 sm:text-3xl">
                      {prompt.title}
                    </h1>
                    <p className="mt-1.5 text-xs text-slate-400">
                      Created {new Date(prompt.createdAt).toLocaleString()} ·
                      Updated {new Date(prompt.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <PromptActions id={prompt._id} content={prompt.content} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 font-sans text-sm leading-7 text-slate-800">
                  {prompt.content}
                </pre>
              </div>
            </>
          )}
        </article>
      </main>
    </>
  );
}
