"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatCfa, PAYMENT_METHODS, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState<(typeof PAYMENT_METHODS)[number]>(PAYMENT_METHODS[0]);
  const activeImage = useMemo(() => {
    return product.colors.find((item) => item.name === color)?.image ?? product.images[0];
  }, [color, product]);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-32 md:grid-cols-2 md:px-8">
      <div className="space-y-4">
        <Image src={activeImage} alt={product.name} width={900} height={1100} className="w-full object-cover" priority />
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image) => (
            <button key={image} type="button" className="cursor-pointer" onClick={() => {
              const match = product.colors.find((item) => item.image === image);
              if (match) setColor(match.name);
            }}>
              <Image src={image} alt="" width={160} height={160} className="h-24 w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-muted">{product.category}</p>
        <h1 className="mt-2 font-serif text-4xl text-navy">{product.name}</h1>
        <p className="mt-4 text-lg">
          {product.compareAt ? <span className="mr-2 text-muted line-through">{formatCfa(product.compareAt)}</span> : null}
          <span className="font-semibold">{formatCfa(product.price)}</span>
          {product.promoPercent ? <span className="ml-3 text-sm text-gold">-{product.promoPercent}%</span> : null}
        </p>
        <p className="mt-6 max-w-lg text-sm leading-7 text-navy/80">{product.description}</p>
        <fieldset className="mt-8">
          <legend className="mb-3 text-sm font-medium">Couleurs disponibles</legend>
          <div className="flex gap-3">
            {product.colors.map((item) => (
              <button
                key={item.name}
                type="button"
                aria-label={item.name}
                onClick={() => setColor(item.name)}
                className={`h-8 w-8 cursor-pointer rounded-full border ${color === item.name ? "ring-2 ring-navy ring-offset-2" : ""}`}
                style={{ backgroundColor: item.hex }}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">{color}</p>
        </fieldset>
        <label className="mt-6 block text-sm font-medium">
          Quantité
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value) || 1)}
            className="mt-2 w-24 border border-black/15 px-3 py-2"
          />
        </label>
        <label className="mt-6 block text-sm font-medium">
          Méthode de paiement
          <select
            className="mt-2 w-full max-w-sm cursor-pointer border border-black/15 px-3 py-2"
            value={payment}
            onChange={(event) => setPayment(event.target.value as (typeof PAYMENT_METHODS)[number])}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="mt-8 cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#c09112]"
          onClick={() => add(product.slug, color, quantity)}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
