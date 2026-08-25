import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { PromptForm } from "@/components/PromptForm";

export default function CreatePromptPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/prompts" className="text-sm font-semibold text-teal-700">
          Back to prompts
        </Link>
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-950">
            Create Prompt
          </h1>
          <div className="mt-6">
            <PromptForm />
          </div>
        </div>
      </main>
    </>
  );
}
