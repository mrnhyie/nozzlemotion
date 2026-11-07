import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { mkdirSync } from "node:fs";

const url = process.env.TURSO_DATABASE_URL;
const client = url
  ? createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  : (mkdirSync("data", { recursive: true }),
    createClient({ url: `file:${process.env.NM_DB_PATH ?? "data/nozzle-motion.db"}` }));

const email = (process.env.NM_ADMIN_EMAIL || process.argv[2] || "").toLowerCase().trim();
const password = process.env.NM_ADMIN_PASSWORD || process.argv[3] || "";

if (!email || !password) {
  console.error("Usage: NM_ADMIN_EMAIL=you@example.com NM_ADMIN_PASSWORD='strong-pass' npm run seed");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
await client.execute(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client','admin')) DEFAULT 'client',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`);

const existing = await client.execute({ sql: "SELECT id, role FROM users WHERE email = ?", args: [email] });
if (existing.rows[0]) {
  await client.execute({ sql: "UPDATE users SET role = 'admin', password_hash = ? WHERE id = ?", args: [hash, Number(existing.rows[0].id)] });
  console.log(`Admin updated: ${email}`);
} else {
  await client.execute({ sql: "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')", args: [email, hash, "Nozzle Motion"] });
  console.log(`Admin created: ${email}`);
}
