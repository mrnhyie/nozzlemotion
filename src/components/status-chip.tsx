import { type OrderStatus } from "@/lib/order-status";

const STYLES: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-amber-100 text-amber-800",
  quoted: "bg-violet-100 text-violet-800",
  printing: "bg-orange-100 text-orange-800",
  "quality-check": "bg-teal-100 text-teal-800",
  shipped: "bg-emerald-100 text-emerald-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-zinc-200 text-zinc-600",
};

export function statusLabel(status: string): string {
  return status.replace(/-/g, " ");
}

export function StatusChip({ status }: { status: string }) {
  const cls = STYLES[status as OrderStatus] ?? "bg-zinc-100 text-zinc-600";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${cls}`}>
      {statusLabel(status)}
    </span>
  );
}
