"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "elaine-fashion-admin";
export const ADMIN_EMAIL = "admin@elaine-fashion.com";
export const ADMIN_PASSWORD = "ElaineFashion2026";

type AdminContextValue = {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem(KEY) === "1");
  }, []);

  const login = useCallback((email: string, password: string) => {
    const ok =
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD;
    if (ok) {
      localStorage.setItem(KEY, "1");
      setIsAdmin(true);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setIsAdmin(false);
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminSession() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminSession must be used within AdminProvider");
  return ctx;
}
