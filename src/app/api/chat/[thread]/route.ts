import { NextResponse } from "next/server";
import { guardUser } from "@/lib/api";
import { canAccessThread, getFilesByIds, listMessages } from "@/lib/queries";
import { publishChatMessageSafe } from "@/lib/chat";

const parseIds = (raw: string | null): number[] => {
  try {
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(Number).filter(Number.isInteger) : [];
  } catch {
    return [];
  }
};

export async function GET(request: Request, { params }: { params: Promise<{ thread: string }> }) {
  const { user, error } = await guardUser();
  if (error) return error;

  const { thread } = await params;
  const threadKey = decodeURIComponent(thread);
  const url = new URL(request.url);
  const after = Number(url.searchParams.get("after") ?? "0");
  if (!threadKey) return NextResponse.json({ error: "Missing thread." }, { status: 400 });
  if (!(await canAccessThread(threadKey, user.id, user.role))) return NextResponse.json({ error: "No access to this thread." }, { status: 403 });

  const rows = await listMessages(threadKey, Number.isInteger(after) && after > 0 ? after : 0);
  const allIds = rows.flatMap((m) => parseIds(m.attachments));
  const files = await getFilesByIds(allIds);
  const byId = new Map(files.map((f) => [Number(f.id), { id: Number(f.id), filename: f.filename, sizeBytes: f.size_bytes }]));

  return NextResponse.json({
    messages: rows.map((m) => ({ ...m, attachments: parseIds(m.attachments).map((id) => byId.get(id)).filter(Boolean) })),
  });
}

export async function POST(request: Request) {
  const { user, error } = await guardUser();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const threadKey = String(body?.thread ?? "").trim();
  const text = String(body?.body ?? "").trim();
  const attachmentIds = Array.isArray(body?.attachments) ? body.attachments.map(Number).filter(Number.isInteger) : [];

  if (!threadKey || (text.length === 0 && attachmentIds.length === 0) || text.length > 4000) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }
  if (!(await canAccessThread(threadKey, user.id, user.role))) {
    return NextResponse.json({ error: "No access to this thread." }, { status: 403 });
  }
  if (attachmentIds.length > 0 && threadKey.startsWith("order:")) {
    const files = await getFilesByIds(attachmentIds);
    const orderId = Number(threadKey.slice(6));
    if (files.length !== attachmentIds.length || files.some((f) => Number(f.order_id) !== orderId)) {
      return NextResponse.json({ error: "Attachment does not belong to this job." }, { status: 400 });
    }
  }

  const msg = await publishChatMessageSafe(threadKey, user.id, user.role, text || "(file)", attachmentIds);
  return NextResponse.json({ ok: true, message: msg });
}
