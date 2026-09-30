"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { PageHero } from "@/components/page-hero";
import { ShopToolbar } from "@/components/shop-toolbar";
import { useCatalog } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { productSearchText } from "@/lib/product-locale";
import type { Category } from "@/lib/products";

function ShopGrid() {
  const searchParams = useSearchParams();
  const { products } = useCatalog();
  const { t, locale } = useI18n();
  const category = searchParams.get("categorie") ?? undefined;
  const sort = searchParams.get("tri") ?? "defaut";
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const list = useMemo(() => {
    let next = category ? products.filter((product) => product.category === (category as Category)) : [...products];
    if (q) {
      next = next.filter((product) => productSearchText(product, locale).includes(q));
    }
    if (sort === "prix-asc") next = [...next].sort((a, b) => a.price - b.price);
    if (sort === "prix-desc") next = [...next].sort((a, b) => b.price - a.price);
    return next;
  }, [category, products, q, sort, locale]);

  return (
    <>
      <ShopToolbar count={list.length} />
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {list.length === 0 ? <p className="mt-8 text-sm text-muted">{t("shopNoProducts")}</p> : null}
    </>
  );
}

export function ShopContent() {
  const { t } = useI18n();
  return (
    <div>
      <PageHero title={t("shop")} image="/products/photo-23.jpg" />
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <Suspense>
          <ShopGrid />
        </Suspense>
      </section>
    </div>
  );
}
