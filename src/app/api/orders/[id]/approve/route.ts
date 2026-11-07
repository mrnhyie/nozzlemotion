import { NextResponse } from "next/server";
import { guardUser } from "@/lib/api";
import { getOrder, updateOrderStatus } from "@/lib/queries";
import { publishChatMessageSafe } from "@/lib/chat";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await guardUser();
  if (error) return error;

  const { id } = await params;
  const order = await getOrder(Number(id));
  if (!order) return NextResponse.json({ error: "Job not found." }, { status: 404 });
  if (order.user_id !== user.id) return NextResponse.json({ error: "Not your job." }, { status: 403 });
  if (order.status !== "quoted") return NextResponse.json({ error: "Only a quoted job can be approved." }, { status: 409 });

  await updateOrderStatus(order.id, "printing", null);
  await publishChatMessageSafe(
    `order:${order.id}`,
    user.id,
    "client",
    order.quote_amount ? `Quote approved at $${order.quote_amount} — job queued for printing.` : "Quote approved — job queued for printing."
  );

  return NextResponse.json({ ok: true, status: "printing" });
}
