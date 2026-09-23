export type Category = "Vêtements" | "Chaussures" | "Accessoires" | "Sacs";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  compareAt?: number;
  promoPercent?: number;
  images: string[];
  colors: { name: string; hex: string; image?: string }[];
  popular?: boolean;
  featured?: boolean;
};

export const PAYMENT_METHODS = [
  "Orange Money",
  "Wave",
  "Carte bancaire",
  "Paiement à la livraison",
] as const;

export const products: Product[] = [
  {
    slug: "chemisier-plisse",
    name: "Chemisier plissé",
    category: "Vêtements",
    description:
      "Chemisier asymétrique à manches fluides, plissé à la taille pour un tombé féminin. Idéal au quotidien comme pour une soirée élégante.",
    price: 9900,
    compareAt: 14900,
    promoPercent: 34,
    images: [
      "/products/photo-01.png",
      "/products/photo-03.png",
      "/products/photo-04.png",
      "/products/photo-02.png",
      "/products/photo-05.png",
      "/products/photo-06.png",
    ],
    colors: [
      { name: "Beige", hex: "#E8D5C4", image: "/products/photo-01.png" },
      { name: "Rouge", hex: "#C81E1E", image: "/products/photo-02.png" },
    ],
    popular: true,
    featured: true,
  },
  {
    slug: "robe-elegante",
    name: "Robe élégante",
    category: "Vêtements",
    description:
      "Robe longue halter avec anneau doré et jupe fluide. Une pièce signature pour les occasions spéciales.",
    price: 12900,
    compareAt: 16900,
    promoPercent: 24,
    images: [
      "/products/photo-07.png",
      "/products/photo-08.png",
      "/products/photo-09.png",
      "/products/photo-10.png",
    ],
    colors: [
      { name: "Chocolat", hex: "#4A2C2A", image: "/products/photo-07.png" },
      { name: "Ivoire", hex: "#E8DCC8", image: "/products/photo-09.png" },
    ],
    popular: true,
    featured: true,
  },
  {
    slug: "escarpin",
    name: "Escarpin",
    category: "Chaussures",
    description:
      "Escarpin slingback à talon kitten, bout pointu. Un classique raffiné pour sublimer vos tenues.",
    price: 15900,
    compareAt: 19900,
    promoPercent: 20,
    images: ["/products/photo-11.png", "/products/photo-12.png"],
    colors: [
      { name: "Noir", hex: "#111111", image: "/products/photo-11.png" },
      { name: "Rose", hex: "#E11D8A", image: "/products/photo-12.png" },
    ],
    featured: true,
  },
  {
    slug: "basket-stay-real",
    name: "Basket Stay Real",
    category: "Chaussures",
    description:
      "Baskets style court en suède et cuir, semelle gomme. Confort et attitude pour un look casual chic.",
    price: 17900,
    compareAt: 23900,
    promoPercent: 25,
    images: [
      "/products/photo-13.png",
      "/products/photo-14.png",
      "/products/photo-15.png",
      "/products/photo-16.png",
    ],
    colors: [
      { name: "Bordeaux", hex: "#7F1D1D", image: "/products/photo-14.png" },
      { name: "Bleu", hex: "#93C5FD", image: "/products/photo-16.png" },
    ],
    popular: true,
  },
  {
    slug: "parure-cristal",
    name: "Parure cristal",
    category: "Accessoires",
    description:
      "Ensemble collier, bracelet et boucles d’oreilles en cristaux. Un éclat discret pour vos looks de soirée.",
    price: 9900,
    compareAt: 14900,
    promoPercent: 34,
    images: ["/products/photo-17.png", "/products/photo-18.png", "/products/photo-22.png"],
    colors: [
      { name: "Or rose", hex: "#E8C4B8", image: "/products/photo-17.png" },
      { name: "Argent", hex: "#C0C0C0", image: "/products/photo-22.png" },
    ],
    popular: true,
  },
  {
    slug: "sac-cabas",
    name: "Sac cabas",
    category: "Sacs",
    description:
      "Cabas structuré en cuir grainé, fermoir doré. Spacieux et élégant pour accompagner vos journées.",
    price: 18900,
    compareAt: 24900,
    promoPercent: 24,
    images: ["/products/photo-19.png", "/products/photo-20.png", "/products/photo-21.png"],
    colors: [
      { name: "Chocolat", hex: "#5C4033", image: "/products/photo-19.png" },
      { name: "Ivoire", hex: "#F5F0EB", image: "/products/photo-21.png" },
    ],
  },
];

export function formatCfa(amount: number) {
  return `CFA ${amount.toLocaleString("fr-FR")}`;
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getFeatured() {
  return products.filter((product) => product.featured);
}

export function getPopular() {
  return products.filter((product) => product.popular);
}

export function getPromos() {
  return products.filter((product) => product.compareAt);
}

export const categories = [
  { name: "Robes", href: "/shop?categorie=Vêtements", image: "/products/photo-09.png" },
  { name: "Chaussures", href: "/shop?categorie=Chaussures", image: "/products/photo-16.png" },
  { name: "Bijoux", href: "/shop?categorie=Accessoires", image: "/products/photo-18.png" },
  { name: "Sacs", href: "/shop?categorie=Sacs", image: "/products/photo-21.png" },
] as const;
