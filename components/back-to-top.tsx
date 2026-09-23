"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <a
      href="#top"
      onClick={(event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="fixed bottom-5 right-5 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-gold text-white shadow-md transition-colors hover:bg-[#c09112]"
      aria-label="Retour en haut"
    >
      <ArrowUp className="h-4 w-4" />
    </a>
  );
}
