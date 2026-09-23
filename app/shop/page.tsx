import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { PageHero } from "@/components/page-hero";
import { products, type Category } from "@/lib/products";
import { ShopToolbar } from "@/components/shop-toolbar";

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  const category = typeof params.categorie === "string" ? params.categorie : undefined;
  const sort = typeof params.tri === "string" ? params.tri : "defaut";
  let list = category
    ? products.filter((product) => product.category === (category as Category))
    : [...products];

  if (sort === "prix-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "prix-desc") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <div>
      <PageHero title="Shop" image="/products/photo-23.jpg" />
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <Suspense>
          <ShopToolbar count={list.length} />
        </Suspense>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
