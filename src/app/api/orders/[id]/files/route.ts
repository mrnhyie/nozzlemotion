import { NextResponse } from "next/server";
import { guardUser } from "@/lib/api";
import { addFile, canAccessThread, getOrder } from "@/lib/queries";
import { saveFile } from "@/lib/storage";
import { publishChatMessageSafe } from "@/lib/chat";

const ALLOWED_EXT = [".stl", ".3mf", ".obj", ".step", ".stp", ".gcode"];
const MAX_BYTES = 200 * 1024 * 1024;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await guardUser();
  if (error) return error;

  const { id } = await params;
  const orderId = Number(id);
  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: "Job not found." }, { status: 404 });
  if (!(await canAccessThread(`order:${orderId}`, user.id, user.role))) {
    return NextResponse.json({ error: "Not your job." }, { status: 403 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  const note = String(form.get("note") ?? "").trim();
  if (files.length === 0) return NextResponse.json({ error: "No files received." }, { status: 400 });

  const ids: number[] = [];
  for (const f of files) {
    const lower = f.name.toLowerCase();
    if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
      return NextResponse.json({ error: `${f.name}: unsupported format. Use ${ALLOWED_EXT.join(", ")}.` }, { status: 400 });
    }
    if (f.size > MAX_BYTES) {
      return NextResponse.json({ error: `${f.name} exceeds the 200 MB limit.` }, { status: 400 });
    }
    const buf = Buffer.from(await f.arrayBuffer());
    const stored = await saveFile(f.name, buf);
    ids.push(await addFile(orderId, order.user_id, f.name, stored.storageKey, stored.url, buf.length));
  }

  const label = files.map((f) => f.name).join(", ");
  await publishChatMessageSafe(
    `order:${orderId}`,
    user.id,
    user.role,
    note || `${user.role === "admin" ? "Team" : "Client"} added ${files.length} file${files.length > 1 ? "s" : ""}: ${label}`,
    ids
  );

  return NextResponse.json({ ok: true, fileIds: ids });
}
