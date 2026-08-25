"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { PromptLanguage, PromptRecord } from "@/types/prompt";

type PromptFormProps = {
  prompt?: PromptRecord;
};

export function PromptForm({ prompt }: PromptFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<PromptLanguage>(
    prompt?.language ?? "english",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch(
      prompt ? `/api/prompts/${prompt._id}` : "/api/prompts",
      {
        method: prompt ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: (formData.get("title") as string)?.trim() || "Image Generator",
          content: formData.get("content"),
          language,
        }),
      },
    );

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.message ?? "Unable to save prompt");
      return;
    }

    router.push(prompt ? `/prompts/${prompt._id}` : "/prompts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Title
        <span className="text-xs font-normal text-slate-400">(optional — defaults to &quot;Image Generator&quot;)</span>
        <input
          name="title"
          type="text"
          placeholder="Image Generator"
          defaultValue={prompt?.title}
          className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-teal-600"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Language
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as PromptLanguage)}
          className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-teal-600"
        >
          <option value="english">English</option>
          <option value="burmese">Burmese</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Prompt
        <textarea
          name="content"
          required
          rows={12}
          defaultValue={prompt?.content}
          className="resize-y rounded-md border border-slate-300 px-3 py-3 leading-7 outline-none focus:border-teal-600"
        />
      </label>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-md bg-teal-600 px-4 font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
      >
        {loading ? "Saving..." : prompt ? "Update Prompt" : "Create Prompt"}
      </button>
    </form>
  );
}
