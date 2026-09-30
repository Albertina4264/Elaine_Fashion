"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  normalizeProduct,
  normalizeStock,
  products as seedProducts,
  type Product,
} from "@/lib/products";

type CatalogContextValue = {
  products: Product[];
  ready: boolean;
  getBySlug: (slug: string) => Product | undefined;
  addProduct: (input: Partial<Product> & Pick<Product, "name" | "price">) => void;
  updateProduct: (slug: string, patch: Partial<Product>) => void;
  removeProduct: (slug: string) => void;
  consumeStockLines: (lines: { slug: string; quantity: number }[]) => boolean;
  featured: Product[];
  popular: Product[];
  promos: Product[];
};

const CatalogContext = createContext<CatalogContextValue | null>(null);
const KEY = "elaine-fashion-catalog";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseCatalog(raw: string | null): Product[] {
  if (!raw) return seedProducts.map(normalizeProduct);
  try {
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed)) return seedProducts.map(normalizeProduct);
    return parsed.map((item) => normalizeProduct(item as Product));
  } catch {
    return seedProducts.map(normalizeProduct);
  }
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => seedProducts.map(normalizeProduct));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(parseCatalog(localStorage.getItem(KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const getBySlug = useCallback((slug: string) => items.find((p) => p.slug === slug), [items]);

  const addProduct = useCallback((input: Partial<Product> & Pick<Product, "name" | "price">) => {
    const slug = slugify(input.name);
    const images = input.images?.length ? input.images : ["/products/photo-01.png"];
    const product = normalizeProduct({
      slug,
      name: input.name,
      price: input.price,
      category: input.category ?? "Vêtements",
      description: input.description ?? "Nouveau produit Elaine Fashion.",
      images,
      colors: input.colors?.length
        ? input.colors
        : [{ name: "Unique", hex: "#1C1917", image: images[0] }],
      stock: normalizeStock(input.stock ?? 0),
      compareAt: input.compareAt,
      promoPercent: input.promoPercent,
      featured: input.featured ?? false,
      popular: input.popular ?? false,
      translations: input.translations,
      primaryImageIndex: input.primaryImageIndex ?? 0,
    });
    setItems((current) => [product, ...current.filter((p) => p.slug !== slug)]);
  }, []);

  const updateProduct = useCallback((slug: string, patch: Partial<Product>) => {
    setItems((current) =>
      current.map((product) => {
        if (product.slug !== slug) return product;
        let next = normalizeProduct({ ...product, ...patch });
        if (patch.stock !== undefined) {
          next = { ...next, stock: normalizeStock(patch.stock) };
        }
        const base = patch.compareAt ?? product.compareAt;
        const promo = patch.promoPercent ?? product.promoPercent;
        if (base && promo && promo > 0) {
          next.price = Math.round(base * (1 - promo / 100));
          next.compareAt = base;
          next.promoPercent = promo;
        }
        return next;
      }),
    );
  }, []);

  const removeProduct = useCallback((slug: string) => {
    setItems((current) => current.filter((p) => p.slug !== slug));
  }, []);

  const consumeStockLines = useCallback((lines: { slug: string; quantity: number }[]) => {
    let success = false;
    setItems((current) => {
      const draft = current.map((p) => ({ ...p }));
      for (const { slug, quantity } of lines) {
        const qty = Math.floor(quantity);
        if (qty <= 0) continue;
        const product = draft.find((p) => p.slug === slug);
        if (!product || product.stock < qty) return current;
      }
      for (const { slug, quantity } of lines) {
        const qty = Math.floor(quantity);
        if (qty <= 0) continue;
        const product = draft.find((p) => p.slug === slug)!;
        product.stock -= qty;
      }
      success = true;
      return draft;
    });
    return success;
  }, []);

  const value = useMemo(
    () => ({
      products: items,
      ready,
      getBySlug,
      addProduct,
      updateProduct,
      removeProduct,
      consumeStockLines,
      featured: items.filter((p) => p.featured),
      popular: items.filter((p) => p.popular),
      promos: items.filter((p) => p.compareAt || p.promoPercent),
    }),
    [addProduct, consumeStockLines, getBySlug, items, ready, removeProduct, updateProduct],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
