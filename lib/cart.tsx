"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProduct, type Product } from "@/lib/products";

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

  const add = useCallback((slug: string, color: string, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.slug === slug && item.color === color);
      if (existing) {
        return current.map((item) =>
          item.slug === slug && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, { slug, color, quantity }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string, color: string) => {
    setItems((current) => current.filter((item) => !(item.slug === slug && item.color === color)));
  }, []);

  const setQuantity = useCallback((slug: string, color: string, quantity: number) => {
    if (quantity < 1) {
      remove(slug, color);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.slug === slug && item.color === color ? { ...item, quantity } : item,
      ),
    );
  }, [remove]);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const lines = items
      .map((item) => {
        const product = getProduct(item.slug);
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
  }, [add, clear, items, open, remove, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
