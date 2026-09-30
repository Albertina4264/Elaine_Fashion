"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Facebook, Heart, Instagram, Menu, Search, ShoppingBag, X, Youtube } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useI18n, type Locale } from "@/lib/i18n";
import { useWishlist } from "@/lib/wishlist";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, setOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const { locale, setLocale, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cream = pathname === "/shop" || pathname.startsWith("/produit");

  const links = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("shop") },
    { href: "/promotions", label: t("promotions") },
    { href: "/a-propos", label: t("about") },
    { href: "/contact", label: t("contact") },
    { href: "/compte", label: t("account") },
  ];

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <header
      className={`absolute inset-x-0 top-0 z-40 ${cream ? "bg-[#f3ead6]/95" : "bg-white/75 backdrop-blur-sm"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex shrink-0 items-center cursor-pointer">
          <Image
            src="/logo.png"
            alt="Elaine Fashion"
            width={72}
            height={72}
            className="h-14 w-14 rounded-full object-cover md:h-16 md:w-16"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-navy lg:flex" aria-label="Principal">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer transition-colors duration-200 hover:text-gold ${active ? "text-gold" : "text-navy"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1 text-navy sm:gap-2">
          <div className="hidden items-center gap-0.5 rounded-full border border-black/10 p-0.5 sm:flex" role="group" aria-label={t("lang")}>
            {(["fr", "pt", "en"] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                className={`cursor-pointer rounded-full px-2 py-1 text-xs uppercase ${locale === code ? "bg-gold text-white" : "hover:bg-black/5"}`}
                onClick={() => setLocale(code)}
              >
                {code}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-full p-2 transition-colors hover:bg-black/5"
            aria-label={t("search")}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/compte#wishlist"
            className="relative cursor-pointer rounded-full p-2 transition-colors hover:bg-black/5"
            aria-label={t("wishlist")}
          >
            <Heart className="h-5 w-5" />
            {wishCount > 0 ? (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                {wishCount}
              </span>
            ) : null}
          </Link>
          <a href="https://facebook.com" className="hidden cursor-pointer p-2 sm:block" aria-label="Facebook">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="https://instagram.com" className="hidden cursor-pointer p-2 sm:block" aria-label="Instagram">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="https://youtube.com" className="hidden cursor-pointer p-2 sm:block" aria-label="YouTube">
            <Youtube className="h-4 w-4" />
          </a>
          <button
            type="button"
            className="relative cursor-pointer rounded-full p-2 transition-colors hover:bg-black/5"
            aria-label={t("openCart")}
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="cursor-pointer p-2 lg:hidden"
            aria-label="Menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {searchOpen ? (
        <form onSubmit={submitSearch} className="border-t border-black/10 bg-white px-4 py-3 md:px-8">
          <div className="mx-auto flex max-w-7xl gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 border border-black/15 px-3 py-2 text-sm"
              autoFocus
            />
            <button type="submit" className="cursor-pointer rounded-full bg-gold px-5 py-2 text-sm text-white">
              {t("search")}
            </button>
          </div>
        </form>
      ) : null}
      {mobileOpen ? (
        <nav className="flex flex-col gap-3 border-t border-black/10 bg-white px-6 py-4 lg:hidden" aria-label="Mobile">
          <div className="flex gap-2 pb-2">
            {(["fr", "pt", "en"] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs uppercase ${locale === code ? "border-gold bg-gold text-white" : ""}`}
                onClick={() => setLocale(code)}
              >
                {code}
              </button>
            ))}
          </div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer py-1 text-navy"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
