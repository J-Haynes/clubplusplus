# Club++

> **Agents:** keep this file current. If you change the stack, structure, deploy flow or a convention below, update this file in the same commit.

Satirical, privacy-themed loyalty card barcode generator for supermarkets. Live at [clubplusplus.nz](https://clubplusplus.nz). Mobile-first PWA meant to be shown at a till; no backend, no accounts, no data collection.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 3 (utility classes inline; `globals.css` is just the Tailwind directives)
- `jsbarcode` renders the CODE128 barcode into an inline `<svg>` (dynamically imported client-side)
- `next-pwa` for the service worker (disabled in dev; generated `public/sw.js` / `workbox-*.js` are gitignored)

## Commands

```bash
npm ci          # install (lockfile is committed)
npm run dev     # http://localhost:3000
npm run build   # run before pushing - there are no tests, the build is the check
```

`npm run lint` exists but ESLint isn't installed as a dependency.

## Layout

- `src/app/page.tsx` - the whole app: number generation (Luhn), barcode rendering/sizing, copy button, info copy, `Mascot` SVG
- `src/app/layout.tsx` - metadata, viewport/theme colour, body background
- `src/app/components/InstallPrompt.tsx` - "add to home screen" banner
- `src/app/icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`, `pwa/icon-*/route.tsx` - images generated with `next/og`
- `public/manifest.json`, `public/icons/icon.svg` - PWA manifest and icon
- `next.config.ts` - security headers and PWA wrapper

## Things to know

- **Strict CSP** in `next.config.ts`: everything is `'self'` only. External scripts, fonts, images or API calls will be blocked unless the CSP is updated too.
- **Barcode sizing** in `page.tsx` is deliberate: it renders once at width 1 to measure, then scales bar width so the barcode fills the container exactly, then swaps to a `viewBox`. Read the comments before changing it.
- **Modes:** a switch fixed to the bottom of the screen toggles `club` (default: NZ Club++ CODE128 number) and `woolies` (Australian Woolworths-styled demo). The choice is saved in `localStorage` under `clubpp-mode`. Theme classes live in the `THEMES` object as full strings so Tailwind's JIT picks them up. Each mode has its own mascot (`Mascot` / `WooliesMascot`).
- **Screen wake lock** keeps the display on while the barcode is shown.
- Palette: slate background (`#020617` / `slate-950`) with amber accents (`#fbbf24` / `amber-400`). Theme colour is duplicated in `layout.tsx`, `manifest.json` and the `next/og` icon files.
- Tone is tongue-in-cheek; keep copy consistent with the "Earn points. Lose privacy. Repeat." voice.

## Deploying

Vercel's GitHub integration deploys production on every push to `main` (remote `git@github.com:J-Haynes/clubplusplus.git`). There's no Vercel config in the repo. Run `npm run build` locally before pushing.
