"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const MATERIALS = ["PLA+", "PETG", "ASA", "TPU (flexible)", "Carbon-PLA", "Not sure — advise me"];
const ACCEPT = ".stl,.3mf,.obj,.step,.stp,.gcode";
const STEPS = ["Upload files", "Job details", "Review & submit"];

export function NewJobForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [values, setValues] = useState({ title: "", material: MATERIALS[0], notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onFiles(list: FileList | null) {
    if (!list) return;
    setError(null);
    setFiles((prev) => {
      const next = [...prev];
      for (const f of Array.from(list)) if (!next.some((p) => p.name === f.name && p.size === f.size)) next.push(f);
      return next;
    });
  }

  function next() {
    setError(null);
    if (step === 0 && files.length === 0) return setError("Attach at least one model file (STL, 3MF, OBJ, STEP).");
    if (step === 1 && values.title.trim().length < 2) return setError("Give the job a title.");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit() {
    setError(null);
    setPending(true);
    const form = new FormData();
    form.append("title", values.title.trim());
    form.append("material", values.material);
    form.append("notes", values.notes.trim());
    for (const f of files) form.append("files", f);
    try {
      const res = await fetch("/api/orders", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Upload failed. Try again.");
        return;
      }
      router.push(`/dashboard/orders/${data.orderId}`);
      router.refresh();
    } catch {
      setError("Network error — nothing was uploaded. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <ol className="mb-8 flex items-center gap-3">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 text-xs font-bold sm:text-sm ${
                i === step ? "text-brand" : i < step ? "text-ink" : "text-ink-soft/50"
              } ${i < step ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                  i < step ? "bg-brand text-white" : i === step ? "animate-step-pulse border-2 border-brand text-brand" : "border border-line text-ink-soft/50"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            <span className={`h-0.5 flex-1 ${i < step ? "bg-brand" : "bg-line"}`} />
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="animate-step-in space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-white px-6 py-14 text-center transition hover:border-brand">
            <svg viewBox="0 0 24 24" className="h-9 w-9 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4m0 0L7 9m5-5 5 5M4 20h16" />
            </svg>
            <span className="text-sm font-semibold">Click to choose your model files</span>
            <span className="text-xs text-ink-soft">STL, 3MF, OBJ, STEP or GCODE · up to 200 MB each</span>
            <input type="file" accept={ACCEPT} multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
          </label>
          {files.length > 0 && (
            <ul className="space-y-1.5">
              {files.map((f) => (
                <li key={`${f.name}-${f.size}`} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm">
                  <span className="truncate font-medium">{f.name}</span>
                  <span className="ml-3 flex shrink-0 items-center gap-3 text-ink-soft">
                    {(f.size / 1024 / 1024).toFixed(1)} MB
                    <button type="button" onClick={() => setFiles((prev) => prev.filter((x) => x !== f))} className="font-semibold text-red-600">
                      Remove
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="animate-step-in space-y-5">
          <label className="block text-sm font-semibold">
            Job title
            <input
              value={values.title}
              onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
              placeholder="e.g. Motor mount v3 — 4 copies"
              className="mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-2.5 font-normal outline-none focus:border-brand"
            />
          </label>
          <label className="block text-sm font-semibold">
            Material
            <select
              value={values.material}
              onChange={(e) => setValues((v) => ({ ...v, material: e.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-2.5 font-normal outline-none focus:border-brand"
            >
              {MATERIALS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Notes for the print team
            <textarea
              value={values.notes}
              onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
              rows={5}
              placeholder="Quantities, tolerances, color, where the part is used…"
              className="mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-2.5 font-normal outline-none focus:border-brand"
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="animate-step-in space-y-4">
          <dl className="rounded-xl border border-line bg-white p-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Title</dt>
              <dd className="text-right font-semibold">{values.title || "—"}</dd>
            </div>
            <div className="mt-3 flex justify-between gap-4">
              <dt className="text-ink-soft">Material</dt>
              <dd className="font-semibold">{values.material}</dd>
            </div>
            <div className="mt-3 flex justify-between gap-4">
              <dt className="text-ink-soft">Files</dt>
              <dd className="text-right font-semibold">{files.length} attached</dd>
            </div>
            {values.notes && (
              <div className="mt-3 border-t border-line pt-3">
                <dt className="text-ink-soft">Notes</dt>
                <dd className="mt-1 whitespace-pre-wrap">{values.notes}</dd>
              </div>
            )}
          </dl>
          <p className="rounded-lg bg-mist px-4 py-3 text-sm text-ink-soft">
            You will get a printability check and a quote in chat — usually within one business day. Nothing is charged before you approve it.
          </p>
        </div>
      )}

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold hover:border-ink">
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Continue
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={pending} className="rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
            {pending ? "Uploading…" : "Submit job"}
          </button>
        )}
      </div>
    </div>
  );
}
