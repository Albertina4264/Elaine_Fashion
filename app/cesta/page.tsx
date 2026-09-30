"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { productDisplayName, primaryImage } from "@/lib/product-locale";
import { formatCfa, normalizeStock } from "@/lib/products";

export default function CartPage() {
  const { lines, subtotal, remove, setQuantity } = useCart();
  const { t, locale } = useI18n();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
      <h1 className="font-serif text-4xl text-navy">{t("cestaTitle")}</h1>
      {lines.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          {t("cestaEmpty")}{" "}
          <Link href="/shop" className="cursor-pointer text-gold">
            {t("cestaSeeProducts")}
          </Link>
        </p>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="py-3" />
                  <th>{t("cestaProduct")}</th>
                  <th>{t("cestaPrice")}</th>
                  <th>{t("cestaQty")}</th>
                  <th>{t("cestaSubtotal")}</th>
                </tr>
              </thead>
              <tbody>
                {lines.map(({ item, product, lineTotal }) => (
                  <tr key={`${item.slug}-${item.color}`} className="border-b border-black/10">
                    <td className="py-4">
                      <button type="button" className="cursor-pointer" aria-label={t("remove")} onClick={() => remove(item.slug, item.color)}>
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Image src={primaryImage(product)} alt="" width={64} height={64} className="h-16 w-16 object-cover" />
                        <Link href={`/produit/${product.slug}`} className="cursor-pointer text-gold">
                          {productDisplayName(product, locale)} - {item.color}
                        </Link>
                      </div>
                    </td>
                    <td>{formatCfa(product.price)}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        max={normalizeStock(product.stock)}
                        value={item.quantity}
                        className="w-16 border px-2 py-1"
                        onChange={(event) => setQuantity(item.slug, item.color, Number(event.target.value) || 1)}
                      />
                    </td>
                    <td>{formatCfa(lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="h-fit border border-black/10 p-6">
            <h2 className="font-serif text-3xl text-navy">{t("cestaTotalLabel")}</h2>
            <div className="mt-6 flex justify-between border-b border-black/10 py-3 text-sm">
              <span>{t("cestaSubtotal")}</span>
              <span>{formatCfa(subtotal)}</span>
            </div>
            <div className="flex justify-between py-3 text-sm font-medium">
              <span>{t("cestaTotal")}</span>
              <span>{formatCfa(subtotal)}</span>
            </div>
            <Link href="/valider" className="mt-6 block cursor-pointer rounded-full bg-gold py-3 text-center text-sm font-medium text-white">
              {t("cestaValidate")}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
