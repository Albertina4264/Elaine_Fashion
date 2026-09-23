"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Menu, ShoppingBag, X, Youtube } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Shop" },
  { href: "/promotions", label: "Promotions" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/contact", label: "Contact" },
  { href: "/compte", label: "My account" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cream = pathname === "/shop" || pathname.startsWith("/produit");

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
        <div className="flex items-center gap-3 text-navy">
          <a href="https://facebook.com" className="hidden cursor-pointer sm:block" aria-label="Facebook">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="https://instagram.com" className="hidden cursor-pointer sm:block" aria-label="Instagram">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="https://youtube.com" className="hidden cursor-pointer sm:block" aria-label="YouTube">
            <Youtube className="h-4 w-4" />
          </a>
          <button
            type="button"
            className="relative cursor-pointer rounded-full p-2 transition-colors hover:bg-black/5"
            aria-label="Ouvrir la cesta"
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
      {mobileOpen ? (
        <nav className="flex flex-col gap-3 border-t border-black/10 bg-white px-6 py-4 lg:hidden" aria-label="Mobile">
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
