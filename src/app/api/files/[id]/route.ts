import { guardUser } from "@/lib/api";
import { canAccessThread, getFile } from "@/lib/queries";
import { readFileBuffer } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await guardUser();
  if (error) return error;

  const { id } = await params;
  const file = await getFile(Number(id));
  if (!file) return new Response("Not found", { status: 404 });

  const allowed = user.role === "admin" || (await canAccessThread(`order:${file.order_id}`, user.id, user.role));
  if (!allowed) return new Response("Forbidden", { status: 403 });

  let buf: Buffer;
  try {
    buf = await readFileBuffer(file.storage_key, file.url);
  } catch {
    return new Response("Stored file missing", { status: 500 });
  }

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${file.filename.replace(/["\r\n]/g, "")}"`,
      "Content-Length": String(buf.length),
    },
  });
}
