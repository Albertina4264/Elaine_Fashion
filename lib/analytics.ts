import type { OrderRecord, OrderStatus } from "@/lib/orders";

export type PeriodPreset = "today" | "last7" | "last30" | "thisMonth" | "custom";

export type DateRange = {
  from: Date;
  to: Date;
};

export type SalesKpis = {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  pendingRevenue: number;
  unitsSold: number;
  averageTicket: number | null;
  salesByDay: { date: string; orders: number; revenue: number }[];
  topProducts: { productSlug: string; name: string; quantity: number; revenue: number }[];
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function resolvePeriod(preset: PeriodPreset, custom?: { from: string; to: string }): DateRange {
  const now = new Date();
  const to = endOfDay(now);

  switch (preset) {
    case "today":
      return { from: startOfDay(now), to };
    case "last7": {
      const from = startOfDay(now);
      from.setDate(from.getDate() - 6);
      return { from, to };
    }
    case "last30": {
      const from = startOfDay(now);
      from.setDate(from.getDate() - 29);
      return { from, to };
    }
    case "thisMonth": {
      const from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      return { from, to };
    }
    case "custom": {
      const fromRaw = custom?.from ? new Date(custom.from) : now;
      const toRaw = custom?.to ? new Date(custom.to) : now;
      return { from: startOfDay(fromRaw), to: endOfDay(toRaw) };
    }
    default:
      return { from: startOfDay(now), to };
  }
}

export function orderInRange(order: OrderRecord, range: DateRange): boolean {
  const created = new Date(order.createdAt);
  return created >= range.from && created <= range.to;
}

export function filterOrdersByRange(orders: OrderRecord[], range: DateRange): OrderRecord[] {
  return orders.filter((order) => orderInRange(order, range));
}

function countByStatus(orders: OrderRecord[], status: OrderStatus): number {
  return orders.filter((o) => o.status === status).length;
}

export function computeSalesKpis(orders: OrderRecord[], range: DateRange): SalesKpis {
  const inRange = filterOrdersByRange(orders, range);

  const paid = inRange.filter((o) => o.status === "paid");
  const pending = inRange.filter((o) => o.status === "pending");
  const cancelled = inRange.filter((o) => o.status === "cancelled");
  const active = inRange.filter((o) => o.status !== "cancelled");

  const totalRevenue = paid.reduce((sum, o) => sum + o.total, 0);
  const pendingRevenue = pending.reduce((sum, o) => sum + o.total, 0);

  let unitsSold = 0;
  const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

  for (const order of active) {
    for (const item of order.items) {
      unitsSold += item.quantity;
      const key = item.productSlug;
      const lineRevenue = item.unitPrice > 0 ? item.unitPrice * item.quantity : 0;
      const existing = productMap.get(key);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += lineRevenue;
      } else {
        productMap.set(key, { name: item.name, quantity: item.quantity, revenue: lineRevenue });
      }
    }
  }

  const topProducts = [...productMap.entries()]
    .map(([productSlug, data]) => ({ productSlug, ...data }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 8);

  const dayMap = new Map<string, { orders: number; revenue: number }>();
  for (const order of inRange) {
    const day = order.createdAt.slice(0, 10);
    const row = dayMap.get(day) ?? { orders: 0, revenue: 0 };
    row.orders += 1;
    if (order.status === "paid") row.revenue += order.total;
    dayMap.set(day, row);
  }

  const salesByDay = [...dayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({ date, ...stats }));

  const averageTicket = paid.length > 0 ? totalRevenue / paid.length : null;

  return {
    totalOrders: inRange.length,
    paidOrders: countByStatus(inRange, "paid"),
    pendingOrders: countByStatus(inRange, "pending"),
    cancelledOrders: countByStatus(inRange, "cancelled"),
    totalRevenue,
    pendingRevenue,
    unitsSold,
    averageTicket,
    salesByDay,
    topProducts,
  };
}

export function periodLabel(preset: PeriodPreset, range: DateRange): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  switch (preset) {
    case "today":
      return "Aujourd'hui";
    case "last7":
      return "7 derniers jours";
    case "last30":
      return "30 derniers jours";
    case "thisMonth":
      return "Ce mois-ci";
    case "custom":
      return `${fmt(range.from)} — ${fmt(range.to)}`;
    default:
      return "";
  }
}

export function buildExecutiveSummary(kpis: SalesKpis, periodName: string): string {
  const parts: string[] = [];
  parts.push(
    `Sur ${periodName}, le site a enregistré ${kpis.totalOrders} commande${kpis.totalOrders !== 1 ? "s" : ""}.`,
  );

  if (kpis.paidOrders > 0) {
    parts.push(
      `${kpis.paidOrders} commande${kpis.paidOrders !== 1 ? "s sont payées" : " est payée"}, pour une recette de ${kpis.totalRevenue.toLocaleString("fr-FR")} CFA.`,
    );
    if (kpis.averageTicket != null) {
      parts.push(`Ticket moyen (commandes payées) : ${Math.round(kpis.averageTicket).toLocaleString("fr-FR")} CFA.`);
    }
  } else {
    parts.push("Aucune commande payée sur cette période — la recette confirmée est de 0 CFA.");
  }

  if (kpis.pendingOrders > 0) {
    parts.push(
      `${kpis.pendingOrders} commande${kpis.pendingOrders !== 1 ? "s restent" : " reste"} en attente (${kpis.pendingRevenue.toLocaleString("fr-FR")} CFA).`,
    );
  }

  if (kpis.cancelledOrders > 0) {
    parts.push(`${kpis.cancelledOrders} commande${kpis.cancelledOrders !== 1 ? "s ont été" : " a été"} annulée${kpis.cancelledOrders !== 1 ? "s" : ""}.`);
  }

  if (kpis.unitsSold > 0) {
    parts.push(`${kpis.unitsSold} article${kpis.unitsSold !== 1 ? "s vendus" : " vendu"} (hors commandes annulées).`);
  }

  if (kpis.topProducts.length > 0) {
    const top = kpis.topProducts[0];
    parts.push(`Produit le plus vendu : « ${top.name} » (${top.quantity} unité${top.quantity !== 1 ? "s" : ""}).`);
  }

  return parts.join(" ");
}
