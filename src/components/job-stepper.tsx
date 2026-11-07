import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";

const STEPS: { status: OrderStatus; label: string; hint: string }[] = [
  { status: "new", label: "Upload", hint: "Files received" },
  { status: "reviewing", label: "Review", hint: "Printability check" },
  { status: "quoted", label: "Quote", hint: "Price + lead time" },
  { status: "printing", label: "Printing", hint: "On the bed" },
  { status: "quality-check", label: "QA", hint: "Measured by hand" },
  { status: "shipped", label: "Shipped", hint: "In transit" },
  { status: "delivered", label: "Delivered", hint: "Done" },
];

export function JobStepper({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-4 text-sm font-semibold text-zinc-600">
        This job was cancelled. Ask in chat if it should be reopened.
      </div>
    );
  }

  const activeIndex = Math.max(0, ORDER_STATUSES.indexOf(status as OrderStatus));

  return (
    <ol className="flex flex-wrap gap-x-1 gap-y-4">
      {STEPS.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <li key={step.status} className="flex min-w-[86px] flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done || active ? "bg-brand" : "bg-line"}`} />
              <span
                className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold ${
                  done
                    ? "border-brand bg-brand text-white"
                    : active
                      ? "animate-step-pulse border-brand bg-white text-brand"
                      : "border-line bg-white text-ink-soft"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "invisible" : done ? "bg-brand" : "bg-line"}`} />
            </div>
            <span className={`mt-2 text-xs font-bold ${active ? "text-brand" : done ? "text-ink" : "text-ink-soft/60"}`}>{step.label}</span>
            <span className="text-[11px] leading-4 text-ink-soft/60">{step.hint}</span>
          </li>
        );
      })}
    </ol>
  );
}
