import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db, migrate } from "./db";

export const SESSION_COOKIE = "nm_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function secretKey(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    createHmac("sha256", "nozzle-motion-dev-fallback").update(process.env.NODE_ENV ?? "dev").digest("hex");
  return new TextEncoder().encode(secret);
}

export type SessionUser = { id: number; email: string; name: string; role: "client" | "admin" };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    const id = Number(payload.sub);
    const role = payload.role === "admin" ? "admin" : "client";
    if (!Number.isInteger(id) || id <= 0) return null;
    return { id, email: String(payload.email ?? ""), name: String(payload.name ?? ""), role };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await createSessionToken(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}

export async function findUserByEmail(email: string) {
  await migrate();
  const res = await db().execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email.toLowerCase().trim()],
  });
  return res.rows[0] ?? null;
}

export async function getUserById(id: number) {
  await migrate();
  const res = await db().execute({ sql: "SELECT * FROM users WHERE id = ?", args: [id] });
  return res.rows[0] ?? null;
}

export async function createUser(email: string, password: string, name: string, role: "client" | "admin") {
  await migrate();
  const hash = await hashPassword(password);
  const res = await db().execute({
    sql: "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
    args: [email.toLowerCase().trim(), hash, name.trim(), role],
  });
  return { id: Number(res.lastInsertRowid), email: email.toLowerCase().trim(), name: name.trim(), role };
}
