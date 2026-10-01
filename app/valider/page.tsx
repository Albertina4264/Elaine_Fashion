"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { productDisplayName } from "@/lib/product-locale";
import { saveOrder } from "@/lib/orders";
import { useRecaptcha } from "@/components/recaptcha-provider";
import {
  formatCfa,
  PAYMENT_METHOD_IDS,
  PAYMENT_METHOD_LABEL_KEYS,
  type PaymentMethodId,
} from "@/lib/products";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { consumeStockLines } = useCatalog();
  const { t, locale } = useI18n();
  const { verify } = useRecaptcha();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [securityError, setSecurityError] = useState(false);

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-40 text-center">
        <h1 className="font-serif text-4xl text-navy">{t("checkoutSuccessTitle")}</h1>
        <p className="mt-4 text-sm text-muted">{t("checkoutSuccessMsg")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-32 md:grid-cols-[1fr_360px] md:px-8">
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const email = String(data.get("email") ?? "");
          const paymentId = String(data.get("payment") ?? PAYMENT_METHOD_IDS[0]) as PaymentMethodId;
          const paymentMethod = t(PAYMENT_METHOD_LABEL_KEYS[paymentId] ?? "paymentOrange");
          setSubmitting(true);
          setSecurityError(false);

          try {
            const verified = await verify("checkout");
            if (!verified) {
              setSecurityError(true);
              return;
            }

            if (
              !consumeStockLines(
                lines.map(({ item }) => ({
                  slug: item.slug,
                  quantity: item.quantity,
                })),
              )
            ) {
              alert(t("stockError"));
              return;
            }

            saveOrder({
              email,
              firstName: String(data.get("firstName") ?? ""),
              lastName: String(data.get("lastName") ?? ""),
              paymentMethod,
              total: subtotal,
              items: lines.map(({ product, item, lineTotal }) => ({
                productSlug: product.slug,
                name: productDisplayName(product, locale),
                color: item.color,
                quantity: item.quantity,
                unitPrice:
                  item.quantity > 0
                    ? lineTotal / item.quantity
                    : product.price,
              })),
            });
            clear();
            setDone(true);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <h1 className="font-serif text-4xl text-navy">{t("checkoutBilling")}</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            {t("firstName")} *
            <input required name="firstName" className="mt-1 w-full border px-3 py-2" />
          </label>
          <label className="text-sm">
            {t("lastName")} *
            <input required name="lastName" className="mt-1 w-full border px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm">
          {t("country")} *
          <select required name="country" defaultValue="Sénégal" className="mt-1 w-full border px-3 py-2">
            <option>Sénégal</option>
            <option>Guinée-Bissau</option>
            <option>Côte d&apos;Ivoire</option>
            <option>France</option>
          </select>
        </label>
        <label className="block text-sm">
          {t("street")} *
          <input required name="street" className="mt-1 w-full border px-3 py-2" placeholder={t("streetPlaceholder")} />
        </label>
        <label className="block text-sm">
          {t("region")} *
          <input required name="region" defaultValue="Dakar" className="mt-1 w-full border px-3 py-2" />
        </label>
        <label className="block text-sm">
          {t("postal")} *
          <input required name="postal" className="mt-1 w-full border px-3 py-2" />
        </label>
        <label className="block text-sm">
          {t("phone")} *
          <input required name="phone" className="mt-1 w-full border px-3 py-2" />
        </label>
        <label className="block text-sm">
          {t("email")} *
          <input required type="email" name="email" className="mt-1 w-full border px-3 py-2" />
        </label>
        <label className="block text-sm">
          {t("paymentMethod")} *
          <select required name="payment" defaultValue={PAYMENT_METHOD_IDS[0]} className="mt-1 w-full border px-3 py-2">
            {PAYMENT_METHOD_IDS.map((id) => (
              <option key={id} value={id}>
                {t(PAYMENT_METHOD_LABEL_KEYS[id])}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          {t("orderNotes")}
          <textarea name="notes" rows={4} className="mt-1 w-full border px-3 py-2" />
        </label>
        {securityError ? (
          <p role="alert" className="text-sm text-red-600">
            {t("recaptchaError")}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? t("submitting") : t("placeOrder")}
        </button>
      </form>
      <aside className="h-fit border border-black/10 p-6">
        <h2 className="font-serif text-3xl text-navy">{t("yourOrder")}</h2>
        <ul className="mt-6 space-y-3 text-sm">
          {lines.map(({ item, product, lineTotal }) => (
            <li key={`${item.slug}-${item.color}`} className="flex justify-between">
              <span>
                {productDisplayName(product, locale)} - {item.color} × {item.quantity}
              </span>
              <span>{formatCfa(lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t pt-3 text-sm font-medium">
          <span>{t("total")}</span>
          <span>{formatCfa(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
