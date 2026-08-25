"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppNav() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="text-base font-semibold text-slate-950">
          Prompt Manager
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/prompts"
            className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
          >
            Prompts
          </Link>
          <Link
            href="/prompts/create"
            className="rounded-md bg-teal-600 px-3 py-2 font-medium text-white hover:bg-teal-700"
          >
            Create
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
