"use client";

import { AdminProvider } from "@/lib/admin-session";
import { CartProvider } from "@/lib/cart";
import { CatalogProvider } from "@/lib/catalog";
import { CustomerProvider } from "@/lib/customer-session";
import { I18nProvider } from "@/lib/i18n";
import { WishlistProvider } from "@/lib/wishlist";
import { RecaptchaProvider } from "@/components/recaptcha-provider";

export function AppProviders({
  children,
  recaptchaSiteKey,
}: {
  children: React.ReactNode;
  recaptchaSiteKey: string;
}) {
  return (
    <I18nProvider>
      <RecaptchaProvider siteKey={recaptchaSiteKey}>
        <CatalogProvider>
          <WishlistProvider>
            <CustomerProvider>
              <AdminProvider>
                <CartProvider>{children}</CartProvider>
              </AdminProvider>
            </CustomerProvider>
          </WishlistProvider>
        </CatalogProvider>
      </RecaptchaProvider>
    </I18nProvider>
  );
}
