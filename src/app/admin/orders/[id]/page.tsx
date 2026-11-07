import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireAdmin, getUserById } from "@/lib/auth";
import { getOrder, listFilesForOrder } from "@/lib/queries";
import { StatusChip } from "@/components/status-chip";
import { OrderStatusControl } from "@/components/order-status-control";
import { ChatPanel } from "@/components/chat-panel";
import { JobStepper } from "@/components/job-stepper";

export const metadata: Metadata = { title: "Job details" };

export const instant = false;

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrder(Number(id));
  if (!order) notFound();
  const files = await listFilesForOrder(order.id);
  const client = await getUserById(order.user_id);
  const clientName = client ? String(client.name) : undefined;

  return (
    <div>
      <div className="mb-6 rounded-xl border border-line bg-white p-5 sm:p-6">
        <JobStepper status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-bold">#{order.id} · {order.title}</h1>
          <div className="flex items-center gap-3">
            <StatusChip status={order.status} />
            <OrderStatusControl orderId={order.id} status={order.status} quote={order.quote_amount} />
          </div>
        </div>
        <dl className="mt-6 space-y-4 rounded-xl border border-line bg-white p-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Material</dt>
            <dd className="font-semibold">{order.material || "To be advised"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Quote</dt>
            <dd className="font-semibold">{order.quote_amount ? `$${order.quote_amount}` : "Not quoted yet"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Submitted</dt>
            <dd className="font-semibold">{order.created_at}</dd>
          </div>
          {order.notes && (
            <div>
              <dt className="text-ink-soft">Client notes</dt>
              <dd className="mt-1 whitespace-pre-wrap">{order.notes}</dd>
            </div>
          )}
        </dl>

        <h2 className="mt-8 font-display text-lg font-bold">Files</h2>
        <ul className="mt-3 space-y-2">
          {files.map((f) => (
            <li key={f.id} className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-sm">
              <span className="truncate font-medium">{f.filename}</span>
              <span className="ml-3 flex shrink-0 items-center gap-3">
                <span className="text-ink-soft">{(f.size_bytes / 1024 / 1024).toFixed(1)} MB</span>
                <a href={`/api/files/${f.id}`} className="font-semibold text-brand hover:underline">Download</a>
              </span>
            </li>
          ))}
          {files.length === 0 && <li className="text-sm text-ink-soft">No files.</li>}
        </ul>
      </div>

      <div>
        <h2 className="font-display text-lg font-bold">Job chat</h2>
        <p className="mb-3 mt-1 text-sm text-ink-soft">Replies here go straight to the client’s dashboard.</p>
        <ChatPanel threadKey={`order:${order.id}`} height="h-[520px]" viewerRole="admin" clientName={clientName} allowUpload orderId={order.id} />
      </div>
      </div>
    </div>
  );
}
