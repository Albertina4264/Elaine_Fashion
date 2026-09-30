"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { useCatalog } from "@/lib/catalog";
import { useCustomer } from "@/lib/customer-session";
import { useI18n } from "@/lib/i18n";
import { orderStatusMessageKey } from "@/lib/order-labels";
import { productDisplayName, primaryImage } from "@/lib/product-locale";
import { formatOrderItemLabel, getOrdersForEmail } from "@/lib/orders";
import { formatCfa } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";

type Tab = "coupons" | "orders" | "wishlist" | "history";

const demoCoupons = [
  { code: "ELAINE10", labelKey: "coupon1Label" as const },
  { code: "FLASH50", labelKey: "coupon2Label" as const },
];

export default function AccountPage() {
  const { session, login, logout } = useCustomer();
  const { t, locale } = useI18n();
  const { slugs } = useWishlist();
  const { products, getBySlug } = useCatalog();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<ReturnType<typeof getOrdersForEmail>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "") as Tab;
    if (hash === "wishlist" || hash === "orders" || hash === "coupons" || hash === "history") {
      setTab(hash);
    }
  }, []);

  useEffect(() => {
    if (session?.email) setOrders(getOrdersForEmail(session.email));
  }, [session?.email]);

  const wishlistProducts = useMemo(
    () => slugs.map((slug) => getBySlug(slug)).filter(Boolean),
    [getBySlug, slugs],
  );

  if (!session) {
    return (
      <div>
        <PageHero title={t("account")} image="/products/photo-23.jpg" />
        <form
          className="mx-auto max-w-md space-y-4 px-4 py-16"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            login(String(data.get("email")), String(data.get("name") || undefined));
          }}
        >
          <h1 className="font-serif text-3xl text-navy">{t("login")}</h1>
          <p className="text-sm text-muted">{t("clientArea")}</p>
          <label className="block text-sm">
            {t("formName")}
            <input name="name" className="mt-1 w-full border px-3 py-2" />
          </label>
          <label className="block text-sm">
            {t("formEmail")} *
            <input required type="email" name="email" className="mt-1 w-full border px-3 py-2" />
          </label>
          <label className="block text-sm">
            {t("password")} *
            <input required type="password" name="password" className="mt-1 w-full border px-3 py-2" />
          </label>
          <button type="submit" className="cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white">
            {t("login")}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <PageHero title={t("account")} image="/products/photo-23.jpg" />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[240px_1fr] md:px-8">
        <aside className="border border-black/10 text-sm">
          {(
            [
              ["coupons", t("coupons")],
              ["orders", t("orders")],
              ["wishlist", t("wishlistTab")],
              ["history", t("history")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`block w-full cursor-pointer border-b px-4 py-3 text-left ${tab === id ? "text-gold" : "text-navy"}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
          <button type="button" className="block w-full cursor-pointer px-4 py-3 text-left text-gold" onClick={logout}>
            {t("logout")}
          </button>
        </aside>
        <div>
          <p className="text-sm text-gold">
            {t("accountHello")} {session.name ?? session.email}
          </p>

          {tab === "coupons" ? (
            <ul className="mt-6 space-y-3 text-sm">
              {demoCoupons.map((coupon) => (
                <li key={coupon.code} className="border border-black/10 px-4 py-3">
                  <strong>{coupon.code}</strong> — {t(coupon.labelKey)}
                </li>
              ))}
            </ul>
          ) : null}

          {tab === "orders" || tab === "history" ? (
            <ul className="mt-6 space-y-4 text-sm">
              {orders.length === 0 ? (
                <li className="text-muted">{t("accountNoOrders")}</li>
              ) : (
                orders.map((order) => (
                  <li key={order.id} className="border border-black/10 px-4 py-3">
                    <p className="font-medium">
                      {order.id} — {formatCfa(order.total)}
                    </p>
                    <p className="text-muted">
                      {new Date(order.createdAt).toLocaleString()} · {t(orderStatusMessageKey(order.status))}
                    </p>
                    <ul className="mt-2 text-navy/80">
                      {order.items.map((item) => (
                        <li key={`${order.id}-${item.productSlug}-${item.color}`}>
                          {formatOrderItemLabel(item)} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              )}
            </ul>
          ) : null}

          {tab === "wishlist" ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {wishlistProducts.length === 0 ? (
                <p className="text-sm text-muted">{t("accountWishlistEmpty")}</p>
              ) : (
                wishlistProducts.map((product) =>
                  product ? (
                    <Link key={product.slug} href={`/produit/${product.slug}`} className="flex cursor-pointer gap-3 border p-3">
                      <Image src={primaryImage(product)} alt="" width={80} height={80} className="h-20 w-20 object-cover" />
                      <div>
                        <p className="font-medium">{productDisplayName(product, locale)}</p>
                        <p className="text-sm">{formatCfa(product.price)}</p>
                      </div>
                    </Link>
                  ) : null,
                )
              )}
            </div>
          ) : null}

          <p className="mt-8 text-xs text-muted">
            {t("accountCatalogNote")}: {products.length} {t("accountProducts")} · {t("accountAdminOnly")}{" "}
            <Link href="/admin" className="text-gold">
              /admin
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
