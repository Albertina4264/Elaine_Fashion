"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ShopToolbar({ count }: { count: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
      <p>{count} résultats affichés</p>
      <label className="flex items-center gap-2">
        <span className="sr-only">Trier</span>
        <select
          className="cursor-pointer border border-black/10 bg-white px-3 py-2"
          defaultValue={searchParams.get("tri") ?? "defaut"}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams.toString());
            if (event.target.value === "defaut") next.delete("tri");
            else next.set("tri", event.target.value);
            const query = next.toString();
            router.push(query ? `${pathname}?${query}` : pathname);
          }}
        >
          <option value="defaut">Tri par défaut</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
        </select>
      </label>
    </div>
  );
}
