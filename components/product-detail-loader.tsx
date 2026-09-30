"use client";

import { ProductDetail } from "@/components/product-detail";
import { useCatalog } from "@/lib/catalog";

export function ProductDetailLoader({ slug }: { slug: string }) {
  const { getBySlug, ready } = useCatalog();
  const product = getBySlug(slug);

  if (!ready) {
    return <div className="px-4 py-40 text-center text-sm text-muted">Chargement…</div>;
  }

  if (!product) {
    return <div className="px-4 py-40 text-center text-sm text-muted">Produit introuvable.</div>;
  }

  return <ProductDetail product={product} />;
}
