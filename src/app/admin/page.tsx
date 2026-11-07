import type { Metadata } from "next";
import Link from "next/link";
import { listAllOrders } from "@/lib/queries";
import { StatusChip } from "@/components/status-chip";
import { OrderStatusControl } from "@/components/order-status-control";

export const metadata: Metadata = { title: "Order queue" };

export const instant = false;

export default async function AdminPage() {
  const orders = await listAllOrders();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Order queue</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">Newest first. Updates post a notice to the client’s job chat automatically.</p>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-12 text-center text-sm text-ink-soft">
          No jobs yet. They will appear here the moment a client uploads files.
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link href={`/admin/orders/${o.id}`} className="font-display text-base font-bold hover:text-brand">
                    #{o.id} · {o.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink-soft">
                    {o.user_name} ({o.user_email}) · {o.material || "material TBD"}
                    {o.quote_amount ? ` · quote $${o.quote_amount}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <StatusChip status={o.status} />
                  <OrderStatusControl orderId={o.id} status={o.status} quote={o.quote_amount} />
                </div>
              </div>
              {o.notes && <p className="mt-3 whitespace-pre-wrap border-t border-line pt-3 text-sm text-ink-soft">{o.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
