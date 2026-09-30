"use client";

import { AdminProvider } from "@/lib/admin-session";
import { CartProvider } from "@/lib/cart";
import { CatalogProvider } from "@/lib/catalog";
import { CustomerProvider } from "@/lib/customer-session";
import { I18nProvider } from "@/lib/i18n";
import { WishlistProvider } from "@/lib/wishlist";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <CatalogProvider>
        <WishlistProvider>
          <CustomerProvider>
            <AdminProvider>
              <CartProvider>{children}</CartProvider>
            </AdminProvider>
          </CustomerProvider>
        </WishlistProvider>
      </CatalogProvider>
    </I18nProvider>
  );
}
