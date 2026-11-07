"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUSES } from "@/lib/order-status";

export function OrderStatusControl({
  orderId,
  status,
  quote,
}: {
  orderId: number;
  status: string;
  quote: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState(status);
  const [nextQuote, setNextQuote] = useState(quote ?? "");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, quoteAmount: nextQuote, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Update failed.");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-brand hover:text-brand"
      >
        Update status
      </button>
    );
  }

  return (
    <form onSubmit={save} className="w-full space-y-2 rounded-lg border border-line bg-white p-3 sm:w-72">
      <div className="flex gap-2">
        <select
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
          className="w-1/2 rounded border border-line px-2 py-1.5 text-sm capitalize outline-none focus:border-brand"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
          ))}
        </select>
        <input
          value={nextQuote}
          onChange={(e) => setNextQuote(e.target.value)}
          inputMode="decimal"
          placeholder="Quote $"
          className="w-1/4 rounded border border-line px-2 py-1.5 text-sm outline-none focus:border-brand"
        />
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note posted to client chat"
        className="w-full rounded border border-line px-2 py-1.5 text-sm outline-none focus:border-brand"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ink">
          Cancel
        </button>
      </div>
    </form>
  );
}
