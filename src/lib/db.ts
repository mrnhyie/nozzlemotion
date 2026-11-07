import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";
import path from "node:path";

let client: Client | undefined;
let ready: Promise<void> | undefined;

export function db(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    if (url) {
      client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
    } else {
      const file = process.env.NM_DB_PATH ?? "data/nozzle-motion.db";
      mkdirSync(path.dirname(path.resolve(/* turbopackIgnore: true */ file)), { recursive: true });
      client = createClient({ url: `file:${file}` });
    }
  }
  return client;
}

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('client','admin')) DEFAULT 'client',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    material TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    quote_amount TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    filename TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    url TEXT,
    size_bytes INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_key TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    author_role TEXT NOT NULL CHECK (author_role IN ('client','admin')),
    body TEXT NOT NULL,
    attachments TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  "CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_key, id)",
  "CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, id)",
  "CREATE INDEX IF NOT EXISTS idx_files_order ON files(order_id)",
];

export async function migrate(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      for (const sql of STATEMENTS) await db().execute(sql);
      const cols = await db().execute("PRAGMA table_info(messages)");
      if (!cols.rows.some((r) => String(r.name) === "attachments")) {
        await db().execute("ALTER TABLE messages ADD COLUMN attachments TEXT");
      }
    })().catch((err) => {
      ready = undefined;
      throw err;
    });
  }
  return ready;
}

