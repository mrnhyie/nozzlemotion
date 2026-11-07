import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { LogoMark } from "@/components/logo";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 font-display text-xl font-bold">
        <LogoMark className="h-9 w-9 text-brand" />
        NOZZLE MOTION
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mb-6 mt-1 text-sm text-ink-soft">Sign in to track jobs and chat with the print team.</p>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
