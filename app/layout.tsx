import type { Metadata } from "next";
import { Cormorant, Great_Vibes, Montserrat } from "next/font/google";
import { AppProviders } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { BackToTop } from "@/components/back-to-top";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Elaine Fashion",
    template: "%s | Elaine Fashion",
  },
  description:
    "Boutique en ligne de vêtements, chaussures, sacs et accessoires. Chaque détail compte. Chaque style aussi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${cormorant.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-navy">
        <AppProviders
          recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <BackToTop />
        </AppProviders>
      </body>
    </html>
  );
}
