"use client";

import { useState } from "react";
import { ChatPanel } from "./chat-panel";
import type { ThreadSummary } from "@/lib/queries";

export function InboxClient({ threads }: { threads: ThreadSummary[] }) {
  const [selected, setSelected] = useState(threads[0]?.threadKey ?? "");

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <ul className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
        {threads.map((t) => {
          const label = t.threadKey.startsWith("order:")
            ? `#${t.threadKey.slice(6)} · ${t.orderTitle ?? "Job"}`
            : `General · ${t.userName}`;
          return (
            <li key={t.threadKey}>
              <button
                onClick={() => setSelected(t.threadKey)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selected === t.threadKey ? "border-brand bg-white shadow-sm" : "border-line bg-white hover:border-brand/50"
                }`}
              >
                <span className="block truncate font-semibold">{label}</span>
                <span className="mt-0.5 block truncate text-ink-soft">{t.lastBody}</span>
                <span className="mt-0.5 block text-xs text-ink-soft/70">{t.userEmail} · {t.lastAt}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div>
        {selected ? (
          <ChatPanel
            key={selected}
            threadKey={selected}
            height="h-[580px]"
            viewerRole="admin"
            clientName={threads.find((t) => t.threadKey === selected)?.userName}
            allowUpload={selected.startsWith("order:")}
            orderId={selected.startsWith("order:") ? Number(selected.slice(6)) : undefined}
          />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-line bg-white text-sm text-ink-soft">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
