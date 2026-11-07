import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { ChatPanel } from "@/components/chat-panel";

export const metadata: Metadata = { title: "Chat" };

export const instant = false;

export default async function GeneralChatPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Chat with the print team</h1>
      <p className="mb-4 mt-1 text-sm text-ink-soft">
        Questions before you upload, material advice, or anything about an existing job that needs a quick answer.
      </p>
      <ChatPanel threadKey={`general:${user.id}`} height="h-[560px]" />
    </div>
  );
}
