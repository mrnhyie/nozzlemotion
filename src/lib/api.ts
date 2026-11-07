import { NextResponse } from "next/server";
import { getSessionUser, requireAdmin, requireUser, type SessionUser } from "@/lib/auth";

export type Guard = { user: SessionUser; error?: never } | { user?: never; error: NextResponse };

export async function guardUser(): Promise<Guard> {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  return { user };
}

export async function guardAdmin(): Promise<Guard> {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  if (user.role !== "admin") return { error: NextResponse.json({ error: "Admin only." }, { status: 403 }) };
  return { user };
}

export { requireAdmin, requireUser };
