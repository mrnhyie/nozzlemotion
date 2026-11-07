import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getOrder, listFilesForOrder } from "@/lib/queries";
import { StatusChip } from "@/components/status-chip";
import { ChatPanel } from "@/components/chat-panel";
import { JobStepper } from "@/components/job-stepper";
import { ApproveQuoteButton } from "@/components/approve-quote-button";

export const metadata: Metadata = { title: "Job details" };

export const instant = false;

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const order = await getOrder(Number(id));
  if (!order) notFound();
  if (order.user_id !== user.id && user.role !== "admin") redirect("/dashboard");

  const files = await listFilesForOrder(order.id);

  return (
    <div>
      <div className="mb-6 rounded-xl border border-line bg-white p-5 sm:p-6">
        <JobStepper status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-bold">#{order.id} · {order.title}</h1>
          <StatusChip status={order.status} />
        </div>
        <dl className="mt-6 space-y-4 rounded-xl border border-line bg-white p-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Material</dt>
            <dd className="font-semibold">{order.material || "To be advised"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Quote</dt>
            <dd className="font-semibold">{order.quote_amount ? `$${order.quote_amount}` : "Pending review"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Submitted</dt>
            <dd className="font-semibold">{order.created_at}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Last update</dt>
            <dd className="font-semibold">{order.updated_at}</dd>
          </div>
          {order.notes && (
            <div>
              <dt className="text-ink-soft">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap">{order.notes}</dd>
            </div>
          )}
        </dl>

        {order.status === "quoted" && (
          <div className="mt-4 rounded-xl border border-brand/30 bg-brand/5 p-5">
            <p className="text-sm font-semibold">
              Ready when you are — approving the quote puts this job in the print queue.
            </p>
            <ApproveQuoteButton orderId={order.id} />
          </div>
        )}

        <h2 className="mt-8 font-display text-lg font-bold">Files</h2>
        {files.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">No files on this job.</p>
        ) : (
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
          </ul>
        )}
      </div>

      <div>
        <h2 className="font-display text-lg font-bold">Chat about this job</h2>
        <p className="mb-3 mt-1 text-sm text-ink-soft">
          Ask questions or attach revised files with the paperclip — the operator printing your part answers here.
        </p>
        <ChatPanel threadKey={`order:${order.id}`} height="h-[520px]" allowUpload orderId={order.id} />
      </div>
      </div>
    </div>
  );
}
