import { NextResponse } from "next/server";
import { findUserByEmail, setSessionCookie, verifyPassword, type SessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  const row = await findUserByEmail(email);
  if (!row || !(await verifyPassword(password, String(row.password_hash)))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }
  const user: SessionUser = {
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name),
    role: row.role === "admin" ? "admin" : "client",
  };
  await setSessionCookie(user);
  return NextResponse.json({ ok: true, role: user.role });
}
