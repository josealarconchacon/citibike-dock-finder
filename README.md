# Citi Bike Dock Finder

Find the nearest Citi Bike station with a free bike or an open dock, using Citi Bike's live public data.

## What it does

- Shows the 10 nearest stations to you or browse on the default location
- Switches between **"I need a bike"** and **"I need a dock"**
- Splits classic bikes from e-bikes
- Shows distance and walking time, with a link to walking directions
- Handles loading, empty and error states

## How it works

- `page.tsx` is a **Server Component**. The first list arrives as ready-made HTML.
- `StationFinder` is a **Client Component**. It handles location and the bike/dock toggle.
- `lib/data.ts` uses the Next.js 16 `"use cache"` directive, so everyone shares one pair of requests to Citi Bike per minute.
- Feed data is checked with **Zod**; stations with zero capacity or not installed are filtered out.
- All logic lives in plain TypeScript functions in `src/lib/`, with unit tests.

## Tech stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Zod · Vitest + React Testing Library · ESLint + Prettier · GitHub Actions · Vercel

## Run it locally

Requires Node.js 22 or newer. No API keys needed.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command             | What it does                     |
| ------------------- | -------------------------------- |
| `npm test`          | Run all unit and component tests |
| `npm run lint`      | ESLint                           |
| `npm run typecheck` | TypeScript with no output        |
| `npm run build`     | Production build                 |

## What I'd do next

- Auto-refresh every 60 seconds while the tab is visible
- Save favorite stations in the browser
- Search by address instead of GPS
- A map view

## Data

Station data comes from Citi Bike's public [GBFS feed](https://gbfs.citibikenyc.com/gbfs/gbfs.json). This project is not affiliated with Citi Bike or Lyft.
