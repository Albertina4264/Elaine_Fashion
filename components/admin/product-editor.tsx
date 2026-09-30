"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { normalizeStock, type Product, type ProductColor, type ProductTranslations } from "@/lib/products";

type Props = {
  product: Product;
  onSave: (patch: Partial<Product>) => void;
  onCancel: () => void;
};

export function ProductEditor({ product, onSave, onCancel }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [compareAt, setCompareAt] = useState(product.compareAt ? String(product.compareAt) : "");
  const [promoPercent, setPromoPercent] = useState(product.promoPercent ? String(product.promoPercent) : "");
  const [stock, setStock] = useState(String(product.stock));
  const [images, setImages] = useState<string[]>(product.images.length ? [...product.images] : ["/products/photo-01.png"]);
  const [primaryIndex, setPrimaryIndex] = useState(product.primaryImageIndex ?? 0);
  const [colors, setColors] = useState<ProductColor[]>(
    product.colors.length ? product.colors.map((c) => ({ ...c })) : [{ name: "Unique", hex: "#1C1917" }],
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [namePt, setNamePt] = useState(product.translations?.pt?.name ?? "");
  const [nameEn, setNameEn] = useState(product.translations?.en?.name ?? "");
  const [descPt, setDescPt] = useState(product.translations?.pt?.description ?? "");
  const [descEn, setDescEn] = useState(product.translations?.en?.description ?? "");
  const [stockError, setStockError] = useState("");

  return (
    <form
      className="mt-6 space-y-4 border border-black/10 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const stockNum = normalizeStock(stock);
        if (String(stock).trim() !== "" && !Number.isFinite(Number(stock))) {
          setStockError(t("stockError"));
          return;
        }
        setStockError("");
        const translations: ProductTranslations = {};
        if (namePt || descPt) translations.pt = { name: namePt || name, description: descPt || description };
        if (nameEn || descEn) translations.en = { name: nameEn || name, description: descEn || description };
        onSave({
          name,
          description,
          price: Number(price),
          compareAt: compareAt ? Number(compareAt) : undefined,
          promoPercent: promoPercent ? Number(promoPercent) : undefined,
          stock: stockNum,
          images: images.length ? images : ["/products/photo-01.png"],
          primaryImageIndex: Math.min(primaryIndex, Math.max(0, images.length - 1)),
          colors,
          translations: translations.pt || translations.en ? translations : undefined,
        });
      }}
    >
      <h3 className="font-medium">
        {t("adminEdit")} {product.name}
      </h3>
      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border px-3 py-2" />
      <div className="grid gap-2 md:grid-cols-3">
        <label className="text-sm">
          {t("cestaPrice")}
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min={0} className="mt-1 w-full border px-3 py-2" required />
        </label>
        <input value={compareAt} onChange={(e) => setCompareAt(e.target.value)} type="number" placeholder="Prix barré" className="border px-3 py-2" />
        <input value={promoPercent} onChange={(e) => setPromoPercent(e.target.value)} type="number" placeholder="Promo %" className="border px-3 py-2" />
      </div>
      <label className="block text-sm">
        {t("adminStock")}
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          type="number"
          min={0}
          step={1}
          className="mt-1 w-full max-w-xs border px-3 py-2"
          required
        />
        {stockError ? <p className="mt-1 text-xs text-red-600">{stockError}</p> : null}
      </label>

      <div>
        <p className="text-sm font-medium">{t("adminPhotos")}</p>
        <ul className="mt-2 space-y-2">
          {images.map((url, index) => (
            <li key={`${url}-${index}`} className="flex flex-wrap items-center gap-2 text-sm">
              <img src={url} alt="" className="h-12 w-12 object-cover" />
              <input
                value={url}
                onChange={(e) => {
                  const next = [...images];
                  next[index] = e.target.value;
                  setImages(next);
                }}
                className="min-w-[200px] flex-1 border px-2 py-1"
              />
              <button
                type="button"
                className="cursor-pointer text-gold"
                onClick={() => setPrimaryIndex(index)}
              >
                {primaryIndex === index ? `★ ${t("adminSetPrimary")}` : t("adminSetPrimary")}
              </button>
              <button
                type="button"
                className="cursor-pointer text-red-600"
                onClick={() => {
                  const next = images.filter((_, i) => i !== index);
                  setImages(next.length ? next : ["/products/photo-01.png"]);
                  if (primaryIndex >= next.length) setPrimaryIndex(0);
                }}
              >
                {t("adminRemovePhoto")}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex gap-2">
          <input
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            placeholder={t("adminAddPhoto")}
            className="flex-1 border px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="cursor-pointer rounded-full border px-4 py-2 text-sm"
            onClick={() => {
              const url = newPhotoUrl.trim();
              if (!url) return;
              setImages((prev) => [...prev, url]);
              setNewPhotoUrl("");
            }}
          >
            {t("adminAddPhoto")}
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">{t("adminColors")}</p>
        <ul className="mt-2 space-y-2">
          {colors.map((color, index) => (
            <li key={index} className="grid gap-2 md:grid-cols-[1fr_120px_auto]">
              <input
                value={color.name}
                placeholder={t("adminColorName")}
                onChange={(e) => {
                  const next = [...colors];
                  next[index] = { ...next[index], name: e.target.value };
                  setColors(next);
                }}
                className="border px-3 py-2"
              />
              <input
                value={color.hex}
                placeholder={t("adminColorHex")}
                onChange={(e) => {
                  const next = [...colors];
                  next[index] = { ...next[index], hex: e.target.value };
                  setColors(next);
                }}
                className="border px-3 py-2"
              />
              <button
                type="button"
                className="cursor-pointer text-red-600 text-sm"
                onClick={() => setColors(colors.filter((_, i) => i !== index))}
              >
                {t("adminRemovePhoto")}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-2 cursor-pointer text-sm text-gold"
          onClick={() => setColors([...colors, { name: "", hex: "#000000" }])}
        >
          + {t("adminAddColor")}
        </button>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-medium">{t("adminTranslations")}</p>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <input value={namePt} onChange={(e) => setNamePt(e.target.value)} placeholder={t("adminNamePt")} className="border px-3 py-2 text-sm" />
          <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={t("adminNameEn")} className="border px-3 py-2 text-sm" />
          <textarea value={descPt} onChange={(e) => setDescPt(e.target.value)} placeholder={t("adminDescPt")} rows={2} className="border px-3 py-2 text-sm" />
          <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder={t("adminDescEn")} rows={2} className="border px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="cursor-pointer rounded-full bg-gold px-5 py-2 text-sm text-white">
          {t("adminSave")}
        </button>
        <button type="button" className="cursor-pointer px-5 py-2 text-sm" onClick={onCancel}>
          {t("adminCancel")}
        </button>
      </div>
    </form>
  );
}
