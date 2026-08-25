import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-950">Register</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create an account before saving prompts.
          </p>
        </div>
        <AuthForm mode="register" />
      </section>
    </main>
  );
}
