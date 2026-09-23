import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row md:px-8">
        <Link href="/" className="cursor-pointer">
          <Image src="/logo.png" alt="Elaine Fashion" width={72} height={72} className="h-16 w-16 rounded-full object-cover" />
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-navy" aria-label="Pied de page">
          <Link href="/" className="cursor-pointer text-gold">Accueil</Link>
          <Link href="/shop" className="cursor-pointer hover:text-gold">Shop</Link>
          <Link href="/promotions" className="cursor-pointer hover:text-gold">Promotions</Link>
          <Link href="/a-propos" className="cursor-pointer hover:text-gold">À Propos</Link>
          <Link href="/contact" className="cursor-pointer hover:text-gold">Contact</Link>
          <Link href="/compte" className="cursor-pointer hover:text-gold">My account</Link>
        </nav>
        <div className="flex gap-3 text-navy">
          <a href="https://facebook.com" aria-label="Facebook" className="cursor-pointer"><Facebook className="h-4 w-4" /></a>
          <a href="https://instagram.com" aria-label="Instagram" className="cursor-pointer"><Instagram className="h-4 w-4" /></a>
          <a href="https://youtube.com" aria-label="YouTube" className="cursor-pointer"><Youtube className="h-4 w-4" /></a>
        </div>
      </div>
      <p className="border-t border-black/10 py-4 text-center text-sm text-navy/70">
        Copyright © {new Date().getFullYear()} Elaine Fashion
      </p>
    </footer>
  );
}
