"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      ...(mode === "signup" ? { name: String(form.get("name") ?? "") } : {}),
    };
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      const target = data.role === "admin" ? "/admin" : next || "/dashboard";
      router.replace(target);
      router.refresh();
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "signup" && (
        <label className="block text-sm font-semibold">
          Name
          <input
            name="name"
            required
            minLength={2}
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-2.5 font-normal outline-none focus:border-brand"
          />
        </label>
      )}
      <label className="block text-sm font-semibold">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-2.5 font-normal outline-none focus:border-brand"
        />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : 1}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-2.5 font-normal outline-none focus:border-brand"
        />
      </label>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        {mode === "signup" ? (
          <>Already have an account? <Link className="font-semibold text-brand" href="/login">Sign in</Link></>
        ) : (
          <>New here? <Link className="font-semibold text-brand" href="/signup">Create an account</Link></>
        )}
      </p>
    </form>
  );
}
