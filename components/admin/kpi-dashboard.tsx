"use client";

import { useMemo, useState } from "react";
import {
  buildExecutiveSummary,
  computeSalesKpis,
  periodLabel,
  resolvePeriod,
  type PeriodPreset,
} from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";
import type { OrderRecord } from "@/lib/orders";
import { formatCfa } from "@/lib/products";

type Props = {
  orders: OrderRecord[];
  catalogProductCount: number;
  totalStockUnits: number;
};

export function KpiDashboard({ orders, catalogProductCount, totalStockUnits }: Props) {
  const { t } = useI18n();
  const [preset, setPreset] = useState<PeriodPreset>("last30");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const PRESETS: { id: PeriodPreset; label: string }[] = [
    { id: "today", label: t("periodToday") },
    { id: "last7", label: t("period7") },
    { id: "last30", label: t("period30") },
    { id: "thisMonth", label: t("periodMonth") },
    { id: "custom", label: t("periodCustom") },
  ];

  const range = useMemo(
    () => resolvePeriod(preset, { from: customFrom, to: customTo }),
    [preset, customFrom, customTo],
  );

  const kpis = useMemo(() => computeSalesKpis(orders, range), [orders, range]);
  const periodName = periodLabel(preset, range);
  const summary = buildExecutiveSummary(kpis, periodName);

  const maxDayOrders = Math.max(1, ...kpis.salesByDay.map((d) => d.orders));

  const cards = [
    { label: t("kpiRevenuePaid"), value: formatCfa(kpis.totalRevenue) },
    { label: t("kpiOrdersTotal"), value: String(kpis.totalOrders) },
    { label: t("kpiPaid"), value: String(kpis.paidOrders) },
    { label: t("kpiPending"), value: String(kpis.pendingOrders) },
    { label: t("kpiCancelled"), value: String(kpis.cancelledOrders) },
    { label: t("kpiUnitsSold"), value: String(kpis.unitsSold) },
    {
      label: t("kpiAvgTicket"),
      value: kpis.averageTicket != null ? formatCfa(Math.round(kpis.averageTicket)) : "—",
    },
    { label: t("kpiStockAvailable"), value: String(totalStockUnits) },
    { label: t("kpiCatalogRefs"), value: String(catalogProductCount) },
  ];

  return (
    <section className="space-y-8" aria-labelledby="kpi-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="kpi-heading" className="font-serif text-3xl text-navy">
            {t("kpiTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted">{periodName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs ${
                preset === p.id ? "border-gold bg-gold/10 text-gold" : "border-black/15 text-navy"
              }`}
              onClick={() => setPreset(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {preset === "custom" ? (
        <div className="flex flex-wrap gap-3 text-sm">
          <label>
            {t("periodFrom")}
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="ml-2 border px-2 py-1" />
          </label>
          <label>
            {t("periodTo")}
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="ml-2 border px-2 py-1" />
          </label>
        </div>
      ) : null}

      <div className="rounded-lg border border-gold/30 bg-gold/5 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-gold">{t("kpiExecutiveSummary")}</p>
        <p className="mt-2 text-sm leading-relaxed text-navy/90">{summary}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="border border-black/10 p-4">
            <p className="text-xs text-muted">{card.label}</p>
            <p className="mt-1 font-serif text-2xl text-navy">{card.value}</p>
          </div>
        ))}
      </div>

      {kpis.pendingRevenue > 0 ? (
        <p className="text-sm text-muted">
          {t("kpiPendingAmount")}: <strong className="text-navy">{formatCfa(kpis.pendingRevenue)}</strong>
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="font-serif text-xl text-navy">{t("kpiEvolution")}</h3>
          {kpis.salesByDay.length === 0 ? (
            <p className="mt-3 text-sm text-muted">{t("kpiNoOrdersPeriod")}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {kpis.salesByDay.map((day) => (
                <li key={day.date} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0 text-muted">
                    {new Date(day.date + "T12:00:00").toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded bg-black/5">
                    <div className="h-full bg-gold" style={{ width: `${(day.orders / maxDayOrders) * 100}%` }} />
                  </div>
                  <span className="w-16 text-right tabular-nums">{day.orders}</span>
                  <span className="hidden w-24 text-right text-xs text-muted sm:inline">
                    {day.revenue > 0 ? formatCfa(day.revenue) : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-muted">{t("kpiBarHint")}</p>
        </div>

        <div>
          <h3 className="font-serif text-xl text-navy">{t("kpiTopProducts")}</h3>
          {kpis.topProducts.length === 0 ? (
            <p className="mt-3 text-sm text-muted">{t("kpiNoSales")}</p>
          ) : (
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted">
                  <th className="py-2 font-normal">{t("kpiProductCol")}</th>
                  <th className="py-2 font-normal">{t("kpiQtyCol")}</th>
                  <th className="py-2 font-normal">{t("kpiRevenueCol")}</th>
                </tr>
              </thead>
              <tbody>
                {kpis.topProducts.map((row) => (
                  <tr key={row.productSlug} className="border-b border-black/5">
                    <td className="py-2 pr-2">{row.name}</td>
                    <td className="py-2 tabular-nums">{row.quantity}</td>
                    <td className="py-2 tabular-nums">{row.revenue > 0 ? formatCfa(row.revenue) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="mt-2 text-xs text-muted">{t("kpiFootnote")}</p>
        </div>
      </div>
    </section>
  );
}
