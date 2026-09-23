"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatCfa, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const image = product.images[0];

  return (
    <article className="group">
      <div className="relative overflow-hidden">
        <Link href={`/produit/${product.slug}`} className="block cursor-pointer">
          <Image
            src={image}
            alt={product.name}
            width={720}
            height={900}
            className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        {product.promoPercent ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#f5edd6] px-3 py-1 text-xs text-navy">
            Promo !
          </span>
        ) : null}
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-navy shadow-sm transition-colors hover:bg-gold hover:text-white"
          aria-label={`Ajouter ${product.name}`}
          onClick={() => add(product.slug, product.colors[0].name)}
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
      <div className="pt-4">
        <Link href={`/produit/${product.slug}`} className="cursor-pointer">
          <h3 className="font-medium text-navy">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted">{product.category}</p>
        <p className="mt-1 text-sm">
          {product.compareAt ? (
            <span className="mr-2 text-muted line-through">{formatCfa(product.compareAt)}</span>
          ) : null}
          <span className="font-semibold">{formatCfa(product.price)}</span>
        </p>
      </div>
    </article>
  );
}
