"use client";

import { useEffect, useRef, useState } from "react";

type Attachment = { id: number; filename: string; sizeBytes: number };
type ChatMessage = {
  id: number;
  thread_key: string;
  author_role: "client" | "admin";
  body: string;
  created_at: string;
  attachments?: Attachment[];
};

export function ChatPanel({
  threadKey,
  height = "h-[440px]",
  viewerRole = "client",
  clientName,
  allowUpload = false,
  orderId,
}: {
  threadKey: string;
  height?: string;
  viewerRole?: "client" | "admin";
  clientName?: string;
  allowUpload?: boolean;
  orderId?: number;
}) {
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [draft, setDraft] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lastIdRef = useRef(0);

  async function load(after: number) {
    const res = await fetch(`/api/chat/${encodeURIComponent(threadKey)}?after=${after}`);
    if (!res.ok) return;
    const data = await res.json();
    const incoming: ChatMessage[] = data.messages;
    if (incoming.length === 0) return;
    lastIdRef.current = Math.max(lastIdRef.current, ...incoming.map((m) => m.id));
    setMessages((prev) => {
      const merged = [...(prev ?? []), ...incoming].filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);
      return merged.sort((a, b) => a.id - b.id);
    });
  }

  useEffect(() => {
    lastIdRef.current = 0;
    setMessages(null);
    setError(null);
    load(0);

    const es = new EventSource(`/api/chat-events/${encodeURIComponent(threadKey)}`);
    es.addEventListener("message", () => load(lastIdRef.current));
    let poll: ReturnType<typeof setInterval> | undefined;
    es.onerror = () => {
      if (!poll) poll = setInterval(() => load(lastIdRef.current), 5000);
    };
    return () => {
      es.close();
      if (poll) clearInterval(poll);
    };
  }, [threadKey]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setPendingFiles((prev) => {
      const next = [...prev];
      for (const f of Array.from(list)) if (!next.some((p) => p.name === f.name && p.size === f.size)) next.push(f);
      return next.slice(0, 5);
    });
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if ((!body && pendingFiles.length === 0) || sending) return;
    setSending(true);
    setError(null);
    try {
      if (pendingFiles.length > 0 && orderId) {
        const form = new FormData();
        for (const f of pendingFiles) form.append("files", f);
        if (body) form.append("note", body);
        const res = await fetch(`/api/orders/${orderId}/files`, { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Upload failed.");
          return;
        }
      } else {
        const res = await fetch(`/api/chat/${encodeURIComponent(threadKey)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thread: threadKey, body }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Message failed to send.");
          return;
        }
      }
      setDraft("");
      setPendingFiles([]);
      if (fileRef.current) fileRef.current.value = "";
      await load(lastIdRef.current);
    } catch {
      setError("Network error — nothing was sent.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
      <div ref={listRef} className={`flex-1 space-y-3 overflow-y-auto p-4 ${height}`}>
        {messages === null ? (
          <p className="text-sm text-ink-soft">Loading conversation…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-ink-soft">No messages yet — say hello.</p>
        ) : (
          messages.map((m) => {
            const mine = m.author_role === viewerRole;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    mine ? "bg-brand text-white" : "bg-mist text-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  {m.attachments && m.attachments.length > 0 && (
                    <ul className={`mt-2 space-y-1 ${mine ? "text-white" : "text-ink"}`}>
                      {m.attachments.map((a) => (
                        <li key={a.id}>
                          <a
                            href={`/api/files/${a.id}`}
                            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                              mine ? "bg-white/20 hover:bg-white/30" : "border border-line bg-white hover:border-brand hover:text-brand"
                            }`}
                          >
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />
                            </svg>
                            <span className="truncate">{a.filename}</span>
                            <span className="ml-auto opacity-70">{(a.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className={`mt-1 text-[11px] ${mine ? "text-white/70" : "text-ink-soft"}`}>
                    {mine ? "You" : viewerRole === "admin" ? clientName ?? "Client" : "Nozzle Motion"} · {m.created_at}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-line px-4 py-2.5">
          {pendingFiles.map((f) => (
            <span key={`${f.name}-${f.size}`} className="flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-xs font-semibold">
              {f.name}
              <button type="button" onClick={() => setPendingFiles((prev) => prev.filter((x) => x !== f))} className="text-red-600 hover:text-red-700">
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={send} className="flex items-center gap-2 border-t border-line p-3">
        {allowUpload && (
          <>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Attach model files"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-brand hover:text-brand"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.5 12.5 21a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10 18.5" />
              </svg>
            </button>
            <input ref={fileRef} type="file" accept=".stl,.3mf,.obj,.step,.stp,.gcode" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
          </>
        )}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={allowUpload ? "Message or attach files…" : "Write a message…"}
          maxLength={4000}
          className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={sending || (!draft.trim() && pendingFiles.length === 0)}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
