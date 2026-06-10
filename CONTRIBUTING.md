# Contributing to ShelfLess

Welcome! ShelfLess is a community-powered inventory discovery app. Here's how to get set up and start contributing.

## What is ShelfLess?
A crowd-sourced scavenger hunt shopping app — users report what's in stock at local bodegas, convenience stores, garage sales, and markets. Think Craigslist meets Google Maps, organized around real-world inventory.

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS (mobile-first)
- **Maps**: Leaflet + OpenStreetMap (no API key needed)
- **Location search**: Nominatim + Overpass API (free, no key)
- **Database**: PocketBase (running on Oracle Cloud)
- **Routing**: React Router v6

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/MilesDotson/shelfless.git
cd shelfless
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the dev server
```bash
npm run dev
```
Open http://localhost:5173

> The app connects to the live PocketBase database at http://161.153.48.193 in dev mode, so you'll see real data. Falls back to mock data if the server is unreachable.

## Project Structure
```
src/
  components/       # Shared UI: Layout, FindCard, RequestCard, StockBadge
  context/          # LocationContext — auto-grabs browser geolocation
  data/             # mockData.ts — fallback data when DB is unavailable
  hooks/            # useLocalStorage (for saved/favorited finds)
  lib/              # pb.ts (PocketBase client), dataService.ts (all DB calls)
  pages/
    Home.tsx              # Landing page
    Feed.tsx              # Browse finds feed
    FindDetail.tsx        # Single find with map
    ReportFind/           # 4-step wizard: location → products → photos → confirm
    RequestFeed.tsx       # Open requests from other users
    CreateRequest.tsx     # Post a new request
  types/            # TypeScript types: Find, Request, Location, etc.
  utils/            # geo.ts (Nominatim/Overpass), time.ts (timeAgo)
```

## How to Contribute

### Making changes
1. Create a branch: `git checkout -b your-feature-name`
2. Make your changes
3. Test locally with `npm run dev`
4. Push: `git push origin your-feature-name`
5. Open a Pull Request on GitHub

### Auto-deploy
Every merge to `main` automatically builds and deploys to the live server at http://161.153.48.193. PRs only run the build step — they don't deploy.

### Adding a new page
1. Create `src/pages/YourPage.tsx`
2. Add a route in `src/App.tsx`
3. Add a nav link in `src/components/Layout.tsx` if needed

### Connecting to the database
Use functions from `src/lib/dataService.ts`:
```ts
import { getFinds, createFind, getRequests, createRequest } from '../lib/dataService'
```
All functions fall back to mock data gracefully if PocketBase is unreachable.

## Design Principles
- **Mobile-first** — design for 390px width first
- **Black/white/gray** palette — the only color is green (`#16A34A`) on links and interactive elements
- **No auth required to browse** — users can see all finds/requests without signing in
- **Fail gracefully** — always show mock data if the API is down

## PocketBase Admin
The database admin UI is at http://161.153.48.193/_/
Ask Miles for access if you need to inspect or modify data directly.

## Questions?
Open an issue on GitHub or message Miles directly.
