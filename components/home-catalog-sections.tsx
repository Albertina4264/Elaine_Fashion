"use client";

import { ProductCard } from "@/components/product-card";
import { useCatalog } from "@/lib/catalog";

export function HomeTrends() {
  const { featured } = useCatalog();
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {featured.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

export function HomePopular() {
  const { popular } = useCatalog();
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {popular.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
