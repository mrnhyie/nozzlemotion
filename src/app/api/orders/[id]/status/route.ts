import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/api";
import { getOrder, updateOrderStatus } from "@/lib/queries";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";
import { appendMessage, publishChatMessageSafe } from "@/lib/chat";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await guardAdmin();
  if (error) return error;

  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId <= 0) return NextResponse.json({ error: "Bad order id." }, { status: 400 });

  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const status = String(body?.status ?? "") as OrderStatus;
  const quote = body?.quoteAmount == null || body.quoteAmount === "" ? null : String(body.quoteAmount).trim();
  const note = String(body?.note ?? "").trim();

  if (!ORDER_STATUSES.includes(status)) return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  if (quote && !/^\d+(\.\d{1,2})?$/.test(quote)) return NextResponse.json({ error: "Quote must be a number." }, { status: 400 });

  await updateOrderStatus(orderId, status, quote);

  const text = note || (status === "cancelled"
    ? "Admin cancelled this job."
    : `Admin moved this job to “${status}”${quote ? ` — quote $${quote}` : ""}.`);
  await publishChatMessageSafe(`order:${orderId}`, user.id, "admin", text);

  return NextResponse.json({ ok: true });
}
