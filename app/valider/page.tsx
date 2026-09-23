"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatCfa, PAYMENT_METHODS } from "@/lib/products";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-40 text-center">
        <h1 className="font-serif text-4xl text-navy">Commande validée</h1>
        <p className="mt-4 text-sm text-muted">Merci. Nous vous contactons pour confirmer le paiement et la livraison.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-32 md:grid-cols-[1fr_360px] md:px-8">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          clear();
          setDone(true);
        }}
      >
        <h1 className="font-serif text-4xl text-navy">Détails de facturation</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">Prénom *<input required name="firstName" className="mt-1 w-full border px-3 py-2" /></label>
          <label className="text-sm">Nom *<input required name="lastName" className="mt-1 w-full border px-3 py-2" /></label>
        </div>
        <label className="block text-sm">Pays/région *
          <select required name="country" defaultValue="Sénégal" className="mt-1 w-full border px-3 py-2">
            <option>Sénégal</option>
            <option>Guinée-Bissau</option>
            <option>Côte d&apos;Ivoire</option>
            <option>France</option>
          </select>
        </label>
        <label className="block text-sm">Numéro et nom de rue *
          <input required name="street" className="mt-1 w-full border px-3 py-2" placeholder="Numéro de voie et nom de la rue" />
        </label>
        <label className="block text-sm">Région / Département *
          <input required name="region" defaultValue="Dakar" className="mt-1 w-full border px-3 py-2" />
        </label>
        <label className="block text-sm">Code postal *<input required name="postal" className="mt-1 w-full border px-3 py-2" /></label>
        <label className="block text-sm">Téléphone *<input required name="phone" className="mt-1 w-full border px-3 py-2" /></label>
        <label className="block text-sm">Adresse e-mail *<input required type="email" name="email" className="mt-1 w-full border px-3 py-2" /></label>
        <label className="block text-sm">Méthode de paiement *
          <select required name="payment" className="mt-1 w-full border px-3 py-2">
            {PAYMENT_METHODS.map((method) => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">Notes de commande (facultatif)
          <textarea name="notes" rows={4} className="mt-1 w-full border px-3 py-2" />
        </label>
        <button type="submit" className="cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white">
          Commander
        </button>
      </form>
      <aside className="h-fit border border-black/10 p-6">
        <h2 className="font-serif text-3xl text-navy">Votre commande</h2>
        <ul className="mt-6 space-y-3 text-sm">
          {lines.map(({ item, product, lineTotal }) => (
            <li key={`${item.slug}-${item.color}`} className="flex justify-between">
              <span>{product.name} - {item.color} × {item.quantity}</span>
              <span>{formatCfa(lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t pt-3 text-sm font-medium">
          <span>Total</span>
          <span>{formatCfa(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
