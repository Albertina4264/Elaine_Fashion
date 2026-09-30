import type { Locale } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { Category, Product } from "@/lib/products";

/** Built-in PT/EN copy for seed catalog slugs (FR remains canonical on Product) */
const seedCopy: Record<
  string,
  Partial<Record<Exclude<Locale, "fr">, { name: string; description: string }>>
> = {
  "chemisier-plisse": {
    pt: {
      name: "Blusa plissada",
      description:
        "Blusa assimétrica de mangas fluidas, plissada na cintura. Ideal para o dia a dia ou ocasiões elegantes.",
    },
    en: {
      name: "Pleated blouse",
      description:
        "Asymmetric blouse with flowing sleeves, pleated at the waist. Perfect for everyday wear or elegant evenings.",
    },
  },
  "robe-elegante": {
    pt: {
      name: "Vestido elegante",
      description: "Vestido longo halter com argola dourada e saia fluida. Peça assinatura para ocasiões especiais.",
    },
    en: {
      name: "Elegant dress",
      description: "Long halter dress with gold ring and flowing skirt. A signature piece for special occasions.",
    },
  },
  escarpin: {
    pt: {
      name: "Sapatos de salto",
      description: "Slingback de salto kitten e bico fino. Um clássico refinado para sublimar os seus looks.",
    },
    en: {
      name: "Heeled pumps",
      description: "Kitten-heel slingback with pointed toe. A refined classic for your outfits.",
    },
  },
  "basket-stay-real": {
    pt: {
      name: "Sapatilhas Stay Real",
      description: "Sapatilhas estilo court em camurça e couro, sola de borracha. Conforto e atitude casual chic.",
    },
    en: {
      name: "Stay Real sneakers",
      description: "Court-style sneakers in suede and leather, rubber sole. Comfort and casual chic attitude.",
    },
  },
  "parure-cristal": {
    pt: {
      name: "Conjunto de cristal",
      description: "Colar, pulseira e brincos em cristais. Brilho discreto para looks de noite.",
    },
    en: {
      name: "Crystal jewelry set",
      description: "Necklace, bracelet and crystal earrings. Subtle sparkle for evening looks.",
    },
  },
  "sac-cabas": {
    pt: {
      name: "Saco tote",
      description: "Tote estruturado em couro granulado, fecho dourado. Espaçoso e elegante para o dia a dia.",
    },
    en: {
      name: "Tote bag",
      description: "Structured grained leather tote with gold clasp. Spacious and elegant for daily use.",
    },
  },
};

const categoryKeys: Record<Category, MessageKey> = {
  Vêtements: "categoryClothing",
  Chaussures: "categoryShoes",
  Accessoires: "categoryAccessories",
  Sacs: "categoryBags",
};

export function productDisplayName(product: Product, locale: Locale): string {
  if (locale === "fr") return product.name;
  const fromProduct = product.translations?.[locale]?.name;
  if (fromProduct) return fromProduct;
  const fromSeed = seedCopy[product.slug]?.[locale]?.name;
  return fromSeed ?? product.name;
}

export function productDisplayDescription(product: Product, locale: Locale): string {
  if (locale === "fr") return product.description;
  const fromProduct = product.translations?.[locale]?.description;
  if (fromProduct) return fromProduct;
  const fromSeed = seedCopy[product.slug]?.[locale]?.description;
  return fromSeed ?? product.description;
}

export function categoryLabel(
  category: Category,
  t: (key: MessageKey) => string,
): string {
  return t(categoryKeys[category]);
}

export function productSearchText(product: Product, locale: Locale): string {
  const parts = [
    product.name,
    product.description,
    product.category,
    productDisplayName(product, locale),
    productDisplayDescription(product, locale),
  ];
  return parts.join(" ").toLowerCase();
}

export function primaryImage(product: Product): string {
  const index = product.primaryImageIndex ?? 0;
  return product.images[index] ?? product.images[0] ?? "/products/photo-01.png";
}
