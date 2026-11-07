import { put } from "@vercel/blob";
import { createHash } from "node:crypto";
import { mkdir, readFile, unlink } from "node:fs/promises";
import path from "node:path";

export type StoredFile = { storageKey: string; url: string | null };

const UPLOAD_DIR = path.resolve(/* turbopackIgnore: true */ process.env.NM_UPLOAD_DIR ?? "uploads");

function safeKey(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace(/[^.a-z0-9]/g, "");
  const base = createHash("sha1").update(`${Date.now()}-${filename}-${Math.random()}`).digest("hex").slice(0, 16);
  return `${base}${ext}`;
}

export async function saveFile(filename: string, data: Buffer): Promise<StoredFile> {
  const key = safeKey(filename);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`nozzle-motion/${key}`, data, { access: "private", token: process.env.BLOB_READ_WRITE_TOKEN });
    return { storageKey: key, url: blob.url };
  }
  await mkdir(UPLOAD_DIR, { recursive: true });
  const { writeFile } = await import("node:fs/promises");
  await writeFile(path.join(UPLOAD_DIR, key), data);
  return { storageKey: key, url: null };
}

export async function readFileBuffer(storageKey: string, blobUrl: string | null): Promise<Buffer> {
  if (blobUrl) {
    const res = await fetch(blobUrl);
    if (!res.ok) throw new Error("Blob fetch failed");
    return Buffer.from(await res.arrayBuffer());
  }
  const clean = path.basename(storageKey);
  return readFile(path.join(UPLOAD_DIR, clean));
}

export async function deleteStoredFile(storageKey: string, blobUrl: string | null): Promise<void> {
  if (blobUrl) return; // blob URLs are long-lived; deletion not needed for v1
  try {
    await unlink(path.join(UPLOAD_DIR, path.basename(storageKey)));
  } catch {
    /* already gone */
  }
}
