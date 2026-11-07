import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/queries";
import { StatusChip } from "@/components/status-chip";

export const metadata: Metadata = { title: "Your jobs" };

export const instant = false;

export default async function DashboardPage() {
  const user = await requireUser();
  const orders = await listOrdersForUser(user.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Your jobs</h1>
        <Link href="/dashboard/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          New job
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-12 text-center">
          <h2 className="font-display text-lg font-bold">No jobs yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            Upload an STL and we will get back to you with a printability check and quote — usually within one business day.
          </p>
          <Link href="/dashboard/new" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-black">
            Upload your first model
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/dashboard/orders/${o.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-5 py-4 hover:border-brand"
              >
                <span>
                  <span className="block font-semibold">#{o.id} · {o.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">
                    {o.material || "Material TBD"} · submitted {o.created_at}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  {o.quote_amount && <span className="text-sm font-bold">${o.quote_amount}</span>}
                  <StatusChip status={o.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
