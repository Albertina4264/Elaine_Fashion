"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  formatCfa,
  normalizeStock,
  PAYMENT_METHOD_IDS,
  PAYMENT_METHOD_LABEL_KEYS,
  type PaymentMethodId,
  type Product,
} from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import {
  categoryLabel,
  productDisplayDescription,
  productDisplayName,
  primaryImage,
} from "@/lib/product-locale";

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const { t, locale } = useI18n();
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState<PaymentMethodId>(PAYMENT_METHOD_IDS[0]);
  const stock = normalizeStock(product.stock);
  const displayName = productDisplayName(product, locale);

  const activeImage = useMemo(() => {
    return product.colors.find((item) => item.name === color)?.image ?? primaryImage(product);
  }, [color, product]);

  const maxQty = Math.max(0, stock);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-32 md:grid-cols-2 md:px-8">
      <div className="space-y-4">
        <Image src={activeImage} alt={displayName} width={900} height={1100} className="w-full object-cover" priority />
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image) => (
            <button
              key={image}
              type="button"
              className="cursor-pointer"
              onClick={() => {
                const match = product.colors.find((item) => item.image === image);
                if (match) setColor(match.name);
              }}
            >
              <Image src={image} alt="" width={160} height={160} className="h-24 w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-muted">{categoryLabel(product.category, t)}</p>
        <h1 className="mt-2 font-serif text-4xl text-navy">{displayName}</h1>
        <p className="mt-4 text-lg">
          {product.compareAt ? <span className="mr-2 text-muted line-through">{formatCfa(product.compareAt)}</span> : null}
          <span className="font-semibold">{formatCfa(product.price)}</span>
          {product.promoPercent ? <span className="ml-3 text-sm text-gold">-{product.promoPercent}%</span> : null}
        </p>
        {stock <= 0 ? (
          <p className="mt-4 text-sm font-medium text-red-700">{t("productOutOfStock")}</p>
        ) : (
          <p className="mt-4 text-sm text-muted">{t("productStockLeft", { count: stock })}</p>
        )}
        <p className="mt-6 max-w-lg text-sm leading-7 text-navy/80">{productDisplayDescription(product, locale)}</p>
        <fieldset className="mt-8">
          <legend className="mb-3 text-sm font-medium">{t("productColors")}</legend>
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
          {t("productQty")}
          <input
            type="number"
            min={1}
            max={maxQty || 1}
            value={quantity}
            disabled={stock <= 0}
            onChange={(event) => {
              const next = Number(event.target.value) || 1;
              setQuantity(Math.min(Math.max(1, next), maxQty || 1));
            }}
            className="mt-2 w-24 border border-black/15 px-3 py-2"
          />
        </label>
        <label className="mt-6 block text-sm font-medium">
          {t("productPayment")}
          <select
            className="mt-2 w-full max-w-sm cursor-pointer border border-black/15 px-3 py-2"
            value={payment}
            onChange={(event) => setPayment(event.target.value as PaymentMethodId)}
          >
            {PAYMENT_METHOD_IDS.map((id) => (
              <option key={id} value={id}>
                {t(PAYMENT_METHOD_LABEL_KEYS[id])}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={stock <= 0}
          className="mt-8 cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#c09112] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => add(product.slug, color, quantity)}
        >
          {t("add")}
        </button>
      </div>
    </div>
  );
}
