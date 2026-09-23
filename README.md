# Elaine Fashion

Boutique en ligne d’[Elaine Fashion](https://github.com/Albertina4264/Elaine_Fashion) : vêtements, chaussures, sacs et accessoires.

## Stack

- Next.js (App Router) + Tailwind CSS
- Vercel (hébergement)
- Supabase (auth, catalogue, commandes) — schéma dans `supabase/migrations`
- Playwright (tests e2e)

## Démarrage

```bash
npm install
npx playwright install chromium
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Copier `.env.example` vers `.env.local` et renseigner les clés Supabase.

## Scripts

- `npm run dev` — serveur local
- `npm run build` — build de production
- `npm run test:e2e` — tests Playwright
