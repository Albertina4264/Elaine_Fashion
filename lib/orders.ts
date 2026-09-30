export type OrderStatus = "pending" | "paid" | "cancelled";

export type OrderItemLine = {
  productSlug: string;
  name: string;
  color: string;
  quantity: number;
  unitPrice: number;
};

/** @deprecated Legacy shape — normalized on read */
type LegacyOrderItem = { name: string; quantity: number };

export type OrderRecord = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  total: number;
  status: OrderStatus;
  paymentMethod?: string;
  items: OrderItemLine[];
  createdAt: string;
};

export type NewOrderInput = Omit<OrderRecord, "id" | "createdAt" | "status"> & {
  status?: OrderStatus;
};

const KEY = "elaine-fashion-orders";

function isOrderItemLine(item: OrderItemLine | LegacyOrderItem): item is OrderItemLine {
  return "productSlug" in item && typeof (item as OrderItemLine).productSlug === "string";
}

function normalizeItem(item: OrderItemLine | LegacyOrderItem): OrderItemLine {
  if (isOrderItemLine(item)) {
    return {
      productSlug: item.productSlug,
      name: item.name,
      color: item.color ?? "",
      quantity: Math.max(0, Number(item.quantity) || 0),
      unitPrice: Math.max(0, Number(item.unitPrice) || 0),
    };
  }
  return {
    productSlug: "unknown",
    name: item.name,
    color: "",
    quantity: Math.max(0, Number(item.quantity) || 0),
    unitPrice: 0,
  };
}

function normalizeOrder(raw: Partial<OrderRecord> & { items?: (OrderItemLine | LegacyOrderItem)[] }): OrderRecord {
  const status = raw.status === "paid" || raw.status === "cancelled" ? raw.status : "pending";
  return {
    id: String(raw.id ?? `EF-${Date.now()}`),
    email: String(raw.email ?? ""),
    firstName: raw.firstName,
    lastName: raw.lastName,
    total: Math.max(0, Number(raw.total) || 0),
    status,
    paymentMethod: raw.paymentMethod,
    items: (raw.items ?? []).map(normalizeItem),
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export function saveOrder(order: NewOrderInput) {
  const entry: OrderRecord = normalizeOrder({
    ...order,
    status: order.status ?? "pending",
    id: `EF-${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
  const list = getOrders();
  list.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(list));
  return entry;
}

export function getOrders(): OrderRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((row) => normalizeOrder(row as Partial<OrderRecord>));
  } catch {
    return [];
  }
}

export function updateOrderStatus(id: string, status: OrderStatus): OrderRecord | null {
  const list = getOrders();
  const index = list.findIndex((order) => order.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], status };
  localStorage.setItem(KEY, JSON.stringify(list));
  return list[index];
}

export function getOrdersForEmail(email: string) {
  return getOrders().filter((order) => order.email.toLowerCase() === email.toLowerCase());
}

export function formatOrderItemLabel(item: OrderItemLine): string {
  if (item.color) return `${item.name} (${item.color})`;
  return item.name;
}

export function orderCustomerLabel(order: OrderRecord): string {
  const name = [order.firstName, order.lastName].filter(Boolean).join(" ").trim();
  return name || order.email;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  paid: "Payée",
  cancelled: "Annulée",
};
