"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { RecaptchaAction } from "@/lib/recaptcha/actions";

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (
    siteKey: string,
    options: { action: RecaptchaAction },
  ) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

type RecaptchaContextValue = {
  verify: (action: RecaptchaAction) => Promise<boolean>;
};

const RecaptchaContext = createContext<RecaptchaContextValue | null>(null);

function waitForApi(timeoutMs = 8000): Promise<Grecaptcha> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const check = () => {
      if (window.grecaptcha) {
        resolve(window.grecaptcha);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error("Google reCAPTCHA did not load."));
        return;
      }

      window.setTimeout(check, 50);
    };

    check();
  });
}

function whenReady(api: Grecaptcha) {
  return new Promise<void>((resolve) => api.ready(resolve));
}

export function RecaptchaProvider({
  children,
  siteKey,
}: {
  children: ReactNode;
  siteKey: string;
}) {
  const verify = useCallback(
    async (action: RecaptchaAction) => {
      if (!siteKey) {
        console.error("RECAPTCHA_SITE_KEY is not configured.");
        return false;
      }

      try {
        const api = await waitForApi();
        await whenReady(api);

        // Tokens expire quickly, so execute only when the user submits.
        const token = await api.execute(siteKey, { action });
        const response = await fetch("/api/recaptcha/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, action }),
        });

        if (!response.ok) return false;

        const result = (await response.json()) as { ok?: boolean };
        return result.ok === true;
      } catch (error) {
        console.error("Unable to verify reCAPTCHA.", error);
        return false;
      }
    },
    [siteKey],
  );

  const value = useMemo(() => ({ verify }), [verify]);

  return (
    <RecaptchaContext.Provider value={value}>
      {siteKey ? (
        <Script
          id="google-recaptcha-v3"
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}&trustedtypes=true`}
          strategy="afterInteractive"
        />
      ) : null}
      {children}
    </RecaptchaContext.Provider>
  );
}

export function useRecaptcha() {
  const context = useContext(RecaptchaContext);
  if (!context) {
    throw new Error("useRecaptcha must be used within RecaptchaProvider");
  }
  return context;
}
