export const ORDER_STATUSES = [
  "new",
  "reviewing",
  "quoted",
  "printing",
  "quality-check",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
