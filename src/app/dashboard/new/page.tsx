import type { Metadata } from "next";
import { NewJobForm } from "@/components/new-job-form";

export const metadata: Metadata = { title: "New job" };

export const instant = false;

export default function NewJobPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Start a new job</h1>
      <p className="mb-8 mt-1 text-sm text-ink-soft">Upload your model and tell us what matters — fit, strength, color, quantity.</p>
      <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
        <NewJobForm />
      </div>
    </div>
  );
}
