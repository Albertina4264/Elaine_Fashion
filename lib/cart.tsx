"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCatalog } from "@/lib/catalog";
import { normalizeStock, type Product } from "@/lib/products";

export type CartItem = {
  slug: string;
  color: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (slug: string, color: string, quantity?: number) => void;
  remove: (slug: string, color: string) => void;
  setQuantity: (slug: string, color: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  lines: { item: CartItem; product: Product; lineTotal: number }[];
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "elaine-fashion-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { getBySlug } = useCatalog();
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const cartQtyForSlug = useCallback(
    (slug: string, current: CartItem[]) => current.filter((i) => i.slug === slug).reduce((s, i) => s + i.quantity, 0),
    [],
  );

  const add = useCallback(
    (slug: string, color: string, quantity = 1) => {
      setItems((current) => {
        const product = getBySlug(slug);
        if (!product || normalizeStock(product.stock) <= 0) return current;
        const max = normalizeStock(product.stock);
        const already = cartQtyForSlug(slug, current);
        let addQty = Math.max(1, Math.floor(quantity));
        if (already + addQty > max) addQty = Math.max(0, max - already);
        if (addQty <= 0) return current;

        const existing = current.find((item) => item.slug === slug && item.color === color);
        if (existing) {
          return current.map((item) =>
            item.slug === slug && item.color === color
              ? { ...item, quantity: item.quantity + addQty }
              : item,
          );
        }
        return [...current, { slug, color, quantity: addQty }];
      });
      setOpen(true);
    },
    [cartQtyForSlug, getBySlug],
  );

  const remove = useCallback((slug: string, color: string) => {
    setItems((current) => current.filter((item) => !(item.slug === slug && item.color === color)));
  }, []);

  const setQuantity = useCallback(
    (slug: string, color: string, quantity: number) => {
      if (quantity < 1) {
        remove(slug, color);
        return;
      }
      setItems((current) => {
        const product = getBySlug(slug);
        const max = product ? normalizeStock(product.stock) : quantity;
        const others = current
          .filter((item) => item.slug === slug && !(item.slug === slug && item.color === color))
          .reduce((sum, item) => sum + item.quantity, 0);
        const capped = Math.min(Math.floor(quantity), Math.max(0, max - others));
        if (capped < 1) {
          return current.filter((item) => !(item.slug === slug && item.color === color));
        }
        return current.map((item) =>
          item.slug === slug && item.color === color ? { ...item, quantity: capped } : item,
        );
      });
    },
    [getBySlug, remove],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const lines = items
      .map((item) => {
        const product = getBySlug(item.slug);
        if (!product) return null;
        return { item, product, lineTotal: product.price * item.quantity };
      })
      .filter((line): line is NonNullable<typeof line> => Boolean(line));
    return {
      items,
      add,
      remove,
      setQuantity,
      clear,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      open,
      setOpen,
      lines,
    };
  }, [add, clear, getBySlug, items, open, remove, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
