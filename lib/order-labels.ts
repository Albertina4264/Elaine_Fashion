import type { MessageKey } from "@/lib/i18n/messages";
import type { OrderStatus } from "@/lib/orders";

export function orderStatusMessageKey(status: OrderStatus): MessageKey {
  switch (status) {
    case "paid":
      return "orderStatusPaid";
    case "cancelled":
      return "orderStatusCancelled";
    default:
      return "orderStatusPending";
  }
}
