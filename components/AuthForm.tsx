"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "login" ? {
        email: payload.email,
        password: payload.password,
      } : payload),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.message ?? "Authentication failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const isLogin = mode === "login";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {!isLogin && (
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Name
          <input
            name="name"
            type="text"
            required
            className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-teal-600"
          />
        </label>
      )}
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Email
        <input
          name="email"
          type="email"
          required
          className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-teal-600"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-teal-600"
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
        className="h-11 rounded-md bg-teal-600 px-4 font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
      </button>
      <p className="text-center text-sm text-slate-600">
        {isLogin ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-semibold text-teal-700 hover:text-teal-800"
        >
          {isLogin ? "Register" : "Login"}
        </Link>
      </p>
    </form>
  );
}
