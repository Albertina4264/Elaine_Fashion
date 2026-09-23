"use client";

import { useMemo, useState } from "react";
import { formatCfa, products } from "@/lib/products";

const seedOrders = [
  { id: "EF-1042", customer: "Matilda Ndiaye", total: 25800, status: "Payée", date: "2026-09-18" },
  { id: "EF-1043", customer: "Anna Sow", total: 17900, status: "En cours", date: "2026-09-20" },
  { id: "EF-1044", customer: "Joseph Diop", total: 31800, status: "Livrée", date: "2026-09-21" },
];

const seedClients = [
  { name: "Matilda Ndiaye", email: "matilda@example.com", orders: 3 },
  { name: "Anna Sow", email: "anna@example.com", orders: 1 },
  { name: "Joseph Diop", email: "joseph@example.com", orders: 2 },
];

export default function AdminPage() {
  const [catalog, setCatalog] = useState(products);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const revenue = useMemo(() => seedOrders.reduce((sum, order) => sum + order.total, 0), []);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 pb-20 pt-32 md:px-8">
      <h1 className="font-serif text-4xl text-navy">Tableau de bord</h1>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Ventes", value: formatCfa(revenue) },
          { label: "Commandes", value: String(seedOrders.length) },
          { label: "Clients", value: String(seedClients.length) },
          { label: "Produits", value: String(catalog.length) },
        ].map((kpi) => (
          <div key={kpi.label} className="border border-black/10 p-5">
            <p className="text-sm text-muted">{kpi.label}</p>
            <p className="mt-2 font-serif text-3xl text-navy">{kpi.value}</p>
          </div>
        ))}
      </section>
      <p className="text-sm text-navy/80">
        Résumé exécutif : les ventes de la période sont portées par les escarpins et les baskets. Le taux de conversion
        promo est élevé. Priorité : réapprovisionner le chemisier plissé et relancer la vente flash -50%.
      </p>

      <section id="produits">
        <h2 className="font-serif text-3xl text-navy">Gestion des produits</h2>
        <form
          className="mt-4 flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name || !price) return;
            setCatalog((current) => [
              {
                ...current[0],
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                name,
                price: Number(price),
                compareAt: undefined,
                promoPercent: undefined,
              },
              ...current,
            ]);
            setName("");
            setPrice("");
          }}
        >
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nom du produit" className="border px-3 py-2" />
          <input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Prix CFA" className="border px-3 py-2" />
          <button type="submit" className="cursor-pointer rounded-full bg-gold px-5 py-2 text-sm text-white">Ajouter</button>
        </form>
        <ul className="mt-6 divide-y border">
          {catalog.map((product) => (
            <li key={product.slug} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{product.name} — {formatCfa(product.price)}</span>
              <button
                type="button"
                className="cursor-pointer text-red-600"
                onClick={() => setCatalog((current) => current.filter((item) => item.slug !== product.slug))}
              >
                Eliminer
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section id="commandes">
        <h2 className="font-serif text-3xl text-navy">Gestion des encomendas</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b"><th className="py-2">N°</th><th>Cliente</th><th>Total</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {seedOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2">{order.id}</td>
                <td>{order.customer}</td>
                <td>{formatCfa(order.total)}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="clients">
        <h2 className="font-serif text-3xl text-navy">Gestion des clientes</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {seedClients.map((client) => (
            <li key={client.email}>{client.name} — {client.email} ({client.orders} commandes)</li>
          ))}
        </ul>
      </section>

      <section id="promotions">
        <h2 className="font-serif text-3xl text-navy">Gestion des promotions</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {products.filter((product) => product.promoPercent).map((product) => (
            <li key={product.slug}>{product.name} : -{product.promoPercent}%</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
