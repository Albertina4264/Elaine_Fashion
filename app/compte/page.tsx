"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";

export default function AccountPage() {
  const [admin, setAdmin] = useState(false);

  if (admin) {
    return (
      <div>
        <PageHero title="My account" image="/products/photo-23.jpg" />
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[240px_1fr] md:px-8">
          <aside className="border border-black/10 text-sm">
            <Link href="/admin" className="block cursor-pointer border-b px-4 py-3 text-gold">Tableau de bord</Link>
            <Link href="/admin#commandes" className="block cursor-pointer border-b px-4 py-3 text-gold">Commandes</Link>
            <Link href="/admin#produits" className="block cursor-pointer border-b px-4 py-3 text-gold">Produits</Link>
            <Link href="/admin#clients" className="block cursor-pointer border-b px-4 py-3 text-gold">Clients</Link>
            <Link href="/admin#promotions" className="block cursor-pointer border-b px-4 py-3 text-gold">Promotions</Link>
            <button type="button" className="block w-full cursor-pointer px-4 py-3 text-left text-gold" onClick={() => setAdmin(false)}>
              Se déconnecter
            </button>
          </aside>
          <div>
            <p className="text-sm text-gold">
              Bonjour admin (vous n&apos;êtes pas admin ? Déconnexion)
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-navy/80">
              À partir du tableau de bord de votre compte, vous pouvez visualiser vos commandes récentes, gérer vos adresses de
              livraison et de facturation ainsi que changer votre mot de passe et les détails de votre compte.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero title="My account" image="/products/photo-23.jpg" />
      <form
        className="mx-auto max-w-md space-y-4 px-4 py-16"
        onSubmit={(event) => {
          event.preventDefault();
          setAdmin(true);
        }}
      >
        <h1 className="font-serif text-3xl text-navy">Connexion</h1>
        <label className="block text-sm">
          E-mail *
          <input required type="email" name="email" className="mt-1 w-full border px-3 py-2" />
        </label>
        <label className="block text-sm">
          Mot de passe *
          <input required type="password" name="password" className="mt-1 w-full border px-3 py-2" />
        </label>
        <button type="submit" className="cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white">
          Se connecter
        </button>
      </form>
    </div>
  );
}
