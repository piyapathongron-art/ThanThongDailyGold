<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DailyGold — Thai Gold Price Display

Stack: Next.js 16 App Router · React 19 · Tailwind CSS v4 · Zustand v5 · Axios · sonner

## Commands

- `npm run dev` — dev server (no env vars needed)
- `npm run build` — production build
- `npm run lint` — ESLint
- No test suite exists.

## Architecture

ห้างทองธารทอง (ThanThong gold shop) display board.

**Key constraints:**
- All pages are `"use client"` — no server components or server actions
- Data fetching in `useEffect`; home page polls API every 5 minutes
- When `apiStatus === 'offline'`, both modes auto-downgrade to `'manual'`
- React Compiler enabled in `next.config.ts`

**Routes:**
- `/` → `src/app/page.tsx` — main display board
- `/edit` → `src/app/edit/page.tsx` — staff overrides & promo uploads

**Path alias:** `@/*` → `src/*`

**CSS:** Tailwind v4 (`@import "tailwindcss"`). Custom design tokens via `@theme inline` in `globals.css`.

## Zustand Store

Persisted to localStorage under key `gold-storage`. Shape:
- `goldBarMode` / `goldOrnamentMode`: `'api' | 'manual'`
- `manualData`: `{ goldBarBuy, goldBarSell, goldBuy, goldSell }` — staff overrides
- `apiData`: last API response (nullable), with `price.gold_bar.{buy,sell}` and `price.gold.{buy,sell}`
- `apiStatus`: `'online' | 'offline' | 'loading'`
- `promoImages`: `string[3]` — data URLs (not static files)

**Hydration guard required** on any page reading the store:
```tsx
const [isHydrated, setIsHydrated] = useState(false);
useEffect(() => { setTimeout(() => setIsHydrated(true), 0); }, []);
if (!isHydrated) return null;
```

## Promo Images

Uploaded as data URLs via `/edit` page, stored in Zustand (persisted to localStorage). **Not** in `public/`. PromoSlider reads from the store.

## API

Hardcoded URL in `src/api/mainApi.js`. No env vars. Gold price data at `api.chnwt.dev/thai-gold-api/latest`.

## Setup

`npm install && npm run dev` — nothing else needed.
