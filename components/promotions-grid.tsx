"use client";

import { ProductCard } from "@/components/product-card";
import { useCatalog } from "@/lib/catalog";

export function PromotionsGrid() {
  const { promos } = useCatalog();
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {promos.map((product) => (
        <div key={product.slug}>
          <ProductCard product={product} />
          {product.promoPercent ? (
            <p className="mt-2 text-sm text-gold">Promotion : -{product.promoPercent}%</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
