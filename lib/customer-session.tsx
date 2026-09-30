"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type CustomerSession = { email: string; name?: string } | null;

type CustomerContextValue = {
  session: CustomerSession;
  login: (email: string, name?: string) => void;
  logout: () => void;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);
const KEY = "elaine-fashion-customer";

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomerSession>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw) as CustomerSession);
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback((email: string, name?: string) => {
    const next = { email, name };
    setSession(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem(KEY);
  }, []);

  const value = useMemo(() => ({ session, login, logout }), [login, logout, session]);

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider");
  return ctx;
}
