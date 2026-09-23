"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatCfa } from "@/lib/products";

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, remove } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/40"
        aria-label="Fermer la cesta"
        onClick={() => setOpen(false)}
      />
      <aside data-testid="cart-drawer" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f8f1de] shadow-xl">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h2 className="font-serif text-2xl">Panier</h2>
          <button type="button" className="cursor-pointer rounded-full border p-1" onClick={() => setOpen(false)} aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <p className="text-sm text-muted">Votre cesta est vide.</p>
          ) : (
            lines.map(({ item, product, lineTotal }) => (
              <div key={`${item.slug}-${item.color}`} className="flex items-center gap-3 border-b border-black/10 pb-4">
                <Image src={product.images[0]} alt={product.name} width={64} height={64} className="h-16 w-16 object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {product.name} - {item.color}
                  </p>
                  <p className="text-sm text-navy/70">
                    {item.quantity} × {formatCfa(product.price)}
                  </p>
                </div>
                <button type="button" className="cursor-pointer" aria-label="Retirer" onClick={() => remove(item.slug, item.color)}>
                  <X className="h-4 w-4" />
                </button>
                <span className="sr-only">{formatCfa(lineTotal)}</span>
              </div>
            ))
          )}
        </div>
        <div className="space-y-3 border-t border-black/10 p-5">
          <div className="flex justify-between text-sm">
            <span>Sous-total :</span>
            <span>{formatCfa(subtotal)}</span>
          </div>
          <Link
            href="/cesta"
            className="block cursor-pointer rounded-full bg-gold py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#c09112]"
            onClick={() => setOpen(false)}
          >
            Voir le panier
          </Link>
          <Link
            href="/valider"
            className="block cursor-pointer rounded-full bg-gold py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#c09112]"
            onClick={() => setOpen(false)}
          >
            Commander
          </Link>
        </div>
      </aside>
    </div>
  );
}
