import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { listThreadsForAdmin } from "@/lib/queries";
import { InboxClient } from "@/components/inbox-client";

export const metadata: Metadata = { title: "Inbox" };

export const instant = false;

export default async function AdminInboxPage() {
  await requireAdmin();
  const threads = await listThreadsForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Inbox</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">Every client conversation — job threads and general chat, newest activity first.</p>
      {threads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-12 text-center text-sm text-ink-soft">
          No conversations yet. A thread opens automatically when a client submits a job or writes in chat.
        </div>
      ) : (
        <InboxClient threads={threads} />
      )}
    </div>
  );
}
