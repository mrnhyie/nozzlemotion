import { NextResponse } from "next/server";
import { guardUser } from "@/lib/api";
import { createOrder, addFile } from "@/lib/queries";
import { saveFile } from "@/lib/storage";
import { publishChatMessageSafe } from "@/lib/chat";

const ALLOWED_EXT = [".stl", ".3mf", ".obj", ".step", ".stp", ".gcode"];
const MAX_BYTES = 200 * 1024 * 1024;

export async function POST(request: Request) {
  const { user, error } = await guardUser();
  if (error) return error;

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });

  const title = String(form.get("title") ?? "").trim();
  const material = String(form.get("material") ?? "").trim();
  const notes = String(form.get("notes") ?? "").trim();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (title.length < 2) return NextResponse.json({ error: "Give the job a title." }, { status: 400 });
  if (files.length === 0) return NextResponse.json({ error: "Attach at least one model file." }, { status: 400 });
  for (const f of files) {
    const lower = f.name.toLowerCase();
    if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
      return NextResponse.json({ error: `${f.name}: unsupported format. Use ${ALLOWED_EXT.join(", ")}.` }, { status: 400 });
    }
    if (f.size > MAX_BYTES) {
      return NextResponse.json({ error: `${f.name} exceeds the 200 MB limit.` }, { status: 400 });
    }
  }

  const orderId = await createOrder(user.id, title, material, notes);
  for (const f of files) {
    const buf = Buffer.from(await f.arrayBuffer());
    const stored = await saveFile(f.name, buf);
    await addFile(orderId, user.id, f.name, stored.storageKey, stored.url, buf.length);
  }

  const threadKey = `order:${orderId}`;
  await publishChatMessageSafe(threadKey, user.id, "client", `New job submitted: ${title}`);

  return NextResponse.json({ ok: true, orderId });
}
