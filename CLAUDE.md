@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Next.js 16)
npm run build    # production build
npm run start    # run production build locally
npm run lint     # ESLint
```

No test suite exists.

## Architecture

Thai gold price display board for ห้างทองธารทอง (ThanThong gold shop).

**Stack:** Next.js 16 App Router · React 19 · Tailwind CSS v4 · Zustand v5 · Axios

**Routes:**
- `/` — main display board (`src/app/page.tsx`)
- `/edit` — staff price override settings (`src/app/edit/page.tsx`)

**Key files:**
- `src/api/mainApi.js` — axios call to external gold API (URL hardcoded, no env vars)
- `src/store/useGoldStore.ts` — Zustand store with localStorage persistence (`gold-storage` key)
- `src/components/` — three presentational components: `GoldPriceCard`, `Header`, `PromoSlider`
- `src/app/globals.css` — Tailwind v4 custom design tokens (`bg-background`, `text-primary`, `gold-gradient-text`, `glass`)

**All pages are `"use client"`** — no server components or server actions. Data fetches happen in `useEffect`. Home page polls the gold API every 5 minutes.

**Zustand store shape:**
- `goldBarMode` / `goldOrnamentMode`: `'api' | 'manual'` — source for each gold type
- `manualData`: staff-entered price overrides
- `apiData`: last successful API response
- `apiStatus`: `'online' | 'offline' | 'loading'`
- When `apiStatus === 'offline'`, both modes auto-downgrade to `'manual'`

**Hydration guard pattern** — required for any new page that reads from the Zustand store. Both existing pages use:
```tsx
const [isHydrated, setIsHydrated] = useState(false);
useEffect(() => { setTimeout(() => setIsHydrated(true), 0); }, []);
if (!isHydrated) return null;
```
This prevents SSR/localStorage mismatch errors.

**Promo images** are static files at `public/promo1.jpg`, `public/promo2.jpg`, `public/promo3.jpg`. To add more, edit the `promoImages` array in `PromoSlider.tsx`.
