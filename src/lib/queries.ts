import { db, migrate } from "./db";
import type { OrderStatus } from "./order-status";

export type OrderRow = {
  id: number;
  user_id: number;
  title: string;
  material: string;
  notes: string;
  status: string;
  quote_amount: string | null;
  created_at: string;
  updated_at: string;
};
export type FileRow = { id: number; order_id: number; user_id: number; filename: string; storage_key: string; url: string | null; size_bytes: number; created_at: string };
export type MessageRow = { id: number; thread_key: string; user_id: number; author_role: "client" | "admin"; body: string; attachments: string | null; created_at: string };
export type UserRow = { id: number; email: string; name: string; role: "client" | "admin"; created_at: string };

const num = (v: unknown) => Number(v);

export async function listOrdersForUser(userId: number): Promise<OrderRow[]> {
  await migrate();
  const r = await db().execute({ sql: "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", args: [userId] });
  return r.rows as unknown as OrderRow[];
}

export async function listAllOrders(): Promise<(OrderRow & { user_name: string; user_email: string })[]> {
  await migrate();
  const r = await db().execute(
    "SELECT o.*, u.name AS user_name, u.email AS user_email FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.id DESC"
  );
  return r.rows as unknown as (OrderRow & { user_name: string; user_email: string })[];
}

export async function getOrder(orderId: number): Promise<OrderRow | null> {
  await migrate();
  const r = await db().execute({ sql: "SELECT * FROM orders WHERE id = ?", args: [orderId] });
  return (r.rows[0] as unknown as OrderRow) ?? null;
}

export async function createOrder(userId: number, title: string, material: string, notes: string): Promise<number> {
  await migrate();
  const r = await db().execute({
    sql: "INSERT INTO orders (user_id, title, material, notes) VALUES (?, ?, ?, ?)",
    args: [userId, title, material, notes],
  });
  return num(r.lastInsertRowid);
}

export async function updateOrderStatus(orderId: number, status: OrderStatus, quoteAmount: string | null): Promise<void> {
  await migrate();
  await db().execute({
    sql: "UPDATE orders SET status = ?, quote_amount = COALESCE(?, quote_amount), updated_at = datetime('now') WHERE id = ?",
    args: [status, quoteAmount, orderId],
  });
}

export async function addFile(orderId: number, userId: number, filename: string, storageKey: string, url: string | null, size: number): Promise<number> {
  await migrate();
  const r = await db().execute({
    sql: "INSERT INTO files (order_id, user_id, filename, storage_key, url, size_bytes) VALUES (?, ?, ?, ?, ?, ?)",
    args: [orderId, userId, filename, storageKey, url, size],
  });
  return num(r.lastInsertRowid);
}

export async function listFilesForOrder(orderId: number): Promise<FileRow[]> {
  await migrate();
  const r = await db().execute({ sql: "SELECT * FROM files WHERE order_id = ? ORDER BY id", args: [orderId] });
  return r.rows as unknown as FileRow[];
}

export async function getFile(fileId: number): Promise<FileRow | null> {
  await migrate();
  const r = await db().execute({ sql: "SELECT * FROM files WHERE id = ?", args: [fileId] });
  return (r.rows[0] as unknown as FileRow) ?? null;
}

export async function appendMessage(threadKey: string, userId: number, role: "client" | "admin", body: string, attachments: number[] = []): Promise<MessageRow> {
  await migrate();
  const r = await db().execute({
    sql: "INSERT INTO messages (thread_key, user_id, author_role, body, attachments) VALUES (?, ?, ?, ?, ?)",
    args: [threadKey, userId, role, body, attachments.length ? JSON.stringify(attachments) : null],
  });
  const row = await db().execute({ sql: "SELECT * FROM messages WHERE id = ?", args: [num(r.lastInsertRowid)] });
  return row.rows[0] as unknown as MessageRow;
}

export async function getFilesByIds(ids: number[]): Promise<FileRow[]> {
  if (ids.length === 0) return [];
  await migrate();
  const placeholders = ids.map(() => "?").join(",");
  const r = await db().execute({ sql: `SELECT * FROM files WHERE id IN (${placeholders})`, args: ids });
  return r.rows as unknown as FileRow[];
}

export async function listMessages(threadKey: string, afterId = 0): Promise<MessageRow[]> {
  await migrate();
  const r = await db().execute({
    sql: "SELECT * FROM messages WHERE thread_key = ? AND id > ? ORDER BY id",
    args: [threadKey, afterId],
  });
  return r.rows as unknown as MessageRow[];
}

export type ThreadSummary = { threadKey: string; lastBody: string; lastAt: string; lastRole: string; userId: number; userName: string; userEmail: string; orderTitle: string | null };

export async function listThreadsForAdmin(): Promise<ThreadSummary[]> {
  await migrate();
  const r = await db().execute(
    `SELECT m.thread_key AS threadKey, m.body AS lastBody, m.created_at AS lastAt, m.author_role AS lastRole,
            m.user_id AS userId, u.name AS userName, u.email AS userEmail, o.title AS orderTitle
     FROM messages m
     JOIN users u ON u.id = m.user_id
     LEFT JOIN orders o ON 'order:' || o.id = m.thread_key
     WHERE m.id IN (SELECT MAX(id) FROM messages GROUP BY thread_key)
     ORDER BY m.id DESC`
  );
  return r.rows as unknown as ThreadSummary[];
}

export async function listThreadsForUser(userId: number): Promise<ThreadSummary[]> {
  await migrate();
  const r = await db().execute({
    sql: `SELECT m.thread_key AS threadKey, m.body AS lastBody, m.created_at AS lastAt, m.author_role AS lastRole,
            m.user_id AS userId, u.name AS userName, u.email AS userEmail, o.title AS orderTitle
     FROM messages m
     JOIN users u ON u.id = m.user_id
     LEFT JOIN orders o ON 'order:' || o.id = m.thread_key
     WHERE m.id IN (SELECT MAX(id) FROM messages GROUP BY thread_key)
       AND (m.thread_key = 'general:' || ? OR m.thread_key IN (SELECT 'order:' || id FROM orders WHERE user_id = ?))
     ORDER BY m.id DESC`,
    args: [userId, userId],
  });
  return r.rows as unknown as ThreadSummary[];
}

export async function listClients(): Promise<UserRow[]> {
  await migrate();
  const r = await db().execute({ sql: "SELECT id, email, name, role, created_at FROM users WHERE role = 'client' ORDER BY id DESC", args: [] });
  return r.rows as unknown as UserRow[];
}

export async function canAccessThread(threadKey: string, userId: number, role: "client" | "admin"): Promise<boolean> {
  if (role === "admin") return threadKey.startsWith("order:") || threadKey.startsWith("general:");
  await migrate();
  const r = await db().execute({
    sql: "SELECT 1 AS ok FROM orders WHERE user_id = ? AND 'order:' || id = ? UNION ALL SELECT 1 WHERE ? = 'general:' || ?",
    args: [userId, threadKey, threadKey, userId],
  });
  return r.rows.length > 0;
}
