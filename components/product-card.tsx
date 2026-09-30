"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { formatCfa, normalizeStock, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import {
  categoryLabel,
  productDisplayDescription,
  productDisplayName,
  primaryImage,
} from "@/lib/product-locale";
import { useWishlist } from "@/lib/wishlist";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { t, locale } = useI18n();
  const image = primaryImage(product);
  const wished = has(product.slug);
  const inStock = normalizeStock(product.stock) > 0;
  const displayName = productDisplayName(product, locale);

  return (
    <article className="group">
      <div className="relative overflow-hidden">
        <Link href={`/produit/${product.slug}`} className="block cursor-pointer">
          <Image
            src={image}
            alt={displayName}
            width={720}
            height={900}
            className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        {product.promoPercent ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#f5edd6] px-3 py-1 text-xs text-navy">{t("promoBadge")}</span>
        ) : null}
        {!inStock ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-navy/80 px-3 py-1 text-xs text-white">{t("productOutOfStock")}</span>
        ) : null}
        <button
          type="button"
          className={`absolute right-14 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors ${wished ? "bg-gold text-white" : "bg-white/90 text-navy hover:bg-gold hover:text-white"}`}
          aria-label={t("wishlist")}
          aria-pressed={wished}
          onClick={() => toggle(product.slug)}
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
        </button>
        <button
          type="button"
          disabled={!inStock}
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-navy shadow-sm transition-colors hover:bg-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`${t("add")} ${displayName}`}
          onClick={() => add(product.slug, product.colors[0].name)}
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
      <div className="pt-4">
        <Link href={`/produit/${product.slug}`} className="cursor-pointer">
          <h3 className="font-medium text-navy">{displayName}</h3>
        </Link>
        <p className="text-sm text-muted">{categoryLabel(product.category, t)}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-navy/75">{productDisplayDescription(product, locale)}</p>
        <p className="mt-2 text-sm">
          {product.compareAt ? <span className="mr-2 text-muted line-through">{formatCfa(product.compareAt)}</span> : null}
          <span className="font-semibold">{formatCfa(product.price)}</span>
        </p>
      </div>
    </article>
  );
}
