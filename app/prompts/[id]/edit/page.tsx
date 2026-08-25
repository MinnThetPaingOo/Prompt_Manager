"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { PromptForm } from "@/components/PromptForm";
import type { PromptRecord } from "@/types/prompt";

export default function EditPromptPage() {
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
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href={prompt ? `/prompts/${prompt._id}` : "/prompts"}
          className="text-sm font-semibold text-teal-700"
        >
          Back
        </Link>
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-950">Edit Prompt</h1>
          <div className="mt-6">
            {loading && <p className="text-slate-500">Loading prompt...</p>}
            {prompt && <PromptForm prompt={prompt} />}
          </div>
        </div>
      </main>
    </>
  );
}
