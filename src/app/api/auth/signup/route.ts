import { NextResponse } from "next/server";
import { createUser, findUserByEmail, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");
  const name = String(body?.name ?? "").trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: "Enter your name." }, { status: 400 });

  if (await findUserByEmail(email)) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

  const user = await createUser(email, password, name, "client");
  await setSessionCookie(user);
  return NextResponse.json({ ok: true, role: user.role });
}
