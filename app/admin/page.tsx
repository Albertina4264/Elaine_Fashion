"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { KpiDashboard } from "@/components/admin/kpi-dashboard";
import { ProductEditor } from "@/components/admin/product-editor";
import { useAdminSession, ADMIN_EMAIL } from "@/lib/admin-session";
import { useCatalog } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { getContactMessages, type ContactMessage } from "@/lib/messages";
import { orderStatusMessageKey } from "@/lib/order-labels";
import {
  getOrders,
  orderCustomerLabel,
  updateOrderStatus,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/orders";
import { formatCfa, totalCatalogStock, type Product } from "@/lib/products";

export default function AdminPage() {
  const { t } = useI18n();
  const { isAdmin, login, logout } = useAdminSession();
  const { products, addProduct, updateProduct, removeProduct } = useCatalog();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loginError, setLoginError] = useState(false);

  const totalStock = useMemo(() => totalCatalogStock(products), [products]);

  const refreshOrders = useCallback(() => {
    setOrders(getOrders());
  }, []);

  useEffect(() => {
    if (isAdmin) {
      setMessages(getContactMessages());
      refreshOrders();
    }
  }, [isAdmin, refreshOrders]);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-40">
        <h1 className="font-serif text-3xl text-navy">{t("adminTitle")}</h1>
        <p className="mt-2 text-sm text-muted">
          {t("adminLoginHint")} ({ADMIN_EMAIL}).
        </p>
        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const ok = login(String(data.get("email")), String(data.get("password")));
            setLoginError(!ok);
          }}
        >
          <label className="block text-sm">
            {t("adminEmail")} *
            <input required type="email" name="email" defaultValue={ADMIN_EMAIL} className="mt-1 w-full border px-3 py-2" />
          </label>
          <label className="block text-sm">
            {t("adminPassword")} *
            <input required type="password" name="password" className="mt-1 w-full border px-3 py-2" />
          </label>
          {loginError ? <p className="text-sm text-red-600">{t("adminLoginError")}</p> : null}
          <button type="submit" className="cursor-pointer rounded-full bg-gold px-8 py-3 text-sm text-white">
            {t("adminSignIn")}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 pb-20 pt-32 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl text-navy">{t("adminDashboard")}</h1>
        <button type="button" className="cursor-pointer text-sm text-gold" onClick={logout}>
          {t("adminSignOut")}
        </button>
      </div>

      <KpiDashboard orders={orders} catalogProductCount={products.length} totalStockUnits={totalStock} />

      <section className="grid gap-4 md:grid-cols-2">
        <div className="border border-black/10 p-5">
          <p className="text-sm text-muted">{t("adminMessagesCount")}</p>
          <p className="mt-2 font-serif text-3xl text-navy">{messages.length}</p>
        </div>
        <div className="border border-black/10 p-5">
          <p className="text-sm text-muted">{t("adminProductsCount")}</p>
          <p className="mt-2 font-serif text-3xl text-navy">{products.length}</p>
        </div>
      </section>

      <section id="messages">
        <h2 className="font-serif text-3xl text-navy">{t("adminMessages")}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {messages.length === 0 ? (
            <li className="text-muted">{t("adminNoMessages")}</li>
          ) : (
            messages.map((msg) => (
              <li key={msg.id} className="border border-black/10 p-4">
                <p className="font-medium">
                  {msg.name} — {msg.email} — {msg.phone}
                </p>
                <p className="mt-2 text-navy/80">{msg.message || "(sans message)"}</p>
                <p className="mt-1 text-xs text-muted">{new Date(msg.createdAt).toLocaleString()}</p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section id="produits">
        <h2 className="font-serif text-3xl text-navy">{t("adminProducts")}</h2>
        <form
          className="mt-4 flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name || !price) return;
            addProduct({ name, price: Number(price), stock: 0 });
            setName("");
            setPrice("");
          }}
        >
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("adminProductNamePh")} className="border px-3 py-2" />
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder={t("adminPricePh")} className="border px-3 py-2" />
          <button type="submit" className="cursor-pointer rounded-full bg-gold px-5 py-2 text-sm text-white">
            {t("adminAddProduct")}
          </button>
        </form>

        <ul className="mt-6 divide-y border">
          {products.map((product) => (
            <li key={product.slug} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <span>
                {product.name} — {formatCfa(product.price)} · {t("adminStock")}: {product.stock}
                {product.promoPercent ? ` (-${product.promoPercent}%)` : ""}
              </span>
              <div className="flex gap-2">
                <button type="button" className="cursor-pointer text-gold" onClick={() => setEditing(product)}>
                  {t("adminEdit")}
                </button>
                <button type="button" className="cursor-pointer text-red-600" onClick={() => removeProduct(product.slug)}>
                  {t("adminDelete")}
                </button>
              </div>
            </li>
          ))}
        </ul>

        {editing ? (
          <ProductEditor
            product={editing}
            onCancel={() => setEditing(null)}
            onSave={(patch) => {
              updateProduct(editing.slug, patch);
              setEditing(null);
            }}
          />
        ) : null}
      </section>

      <section id="commandes">
        <h2 className="font-serif text-3xl text-navy">{t("adminOrders")}</h2>
        <p className="mt-1 text-sm text-muted">{t("adminOrdersHint")}</p>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("adminNoOrders")}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-2">{t("adminOrderColId")}</th>
                  <th className="py-2 pr-2">{t("adminOrderColCustomer")}</th>
                  <th className="py-2 pr-2">{t("adminOrderColTotal")}</th>
                  <th className="py-2 pr-2">{t("adminOrderColDate")}</th>
                  <th className="py-2">{t("adminOrderColStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-black/5">
                    <td className="py-2 pr-2 font-medium">{order.id}</td>
                    <td className="py-2 pr-2">{orderCustomerLabel(order)}</td>
                    <td className="py-2 pr-2">{formatCfa(order.total)}</td>
                    <td className="py-2 pr-2 text-muted">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-2">
                      <select
                        className="cursor-pointer border px-2 py-1 text-sm"
                        value={order.status}
                        onChange={(e) => {
                          updateOrderStatus(order.id, e.target.value as OrderStatus);
                          refreshOrders();
                        }}
                      >
                        {(["pending", "paid", "cancelled"] as OrderStatus[]).map((status) => (
                          <option key={status} value={status}>
                            {t(orderStatusMessageKey(status))}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
