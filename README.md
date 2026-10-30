# BrutalCheapFlights

A zero-commission flight search site for Indian travellers. Prices are in INR (Rs.). Live site: https://brutalcheapflights.vercel.app

## Features

- **Flight search** across three providers with automatic fallback.
- **Booking channel comparison** (airline direct vs OTAs) with typical convenience fees. Fees are hardcoded estimates.
- **Live flight tracking** by flight number, airport or airline (Aviationstack).
- **Visa information** for destinations, for Indian passport holders. The data is static and can go stale; verify with the embassy.
- **"How It Works" section** on the home page explaining the search flow (`#how-it-works`).

## How it works

1. The browser calls `GET /api/search?from&to&date[&returnDate&adults&cabinClass]`.
2. `server.js` tries providers in order: Google Flights (RapidAPI, ~150 requests/month), Sky-Scrapper (RapidAPI, ~100/month), then FlightAPI.io (~10 searches). The first non-empty result wins.
3. A provider that returns a 429 is marked exhausted (in memory, per instance) and tried last next time.
4. Results are normalized to one shape, sorted by price and tagged `isCheapest`, `isBestDirect` and `isFastest`.

Searches use limited free quota, so avoid automated or looped calls.

## API

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Which providers are configured or exhausted |
| `GET /api/search` | Flight search (400 on missing params, 503 no keys, 429 quotas exhausted) |
| `GET /api/track?flight_iata=` | Track a flight |
| `GET /api/track/airport?iata&type&status` | Airport arrivals/departures |
| `GET /api/track/airline?iata&status` | Airline flights |
| `GET /api/visa?destination=<IATA>` | Visa info for a destination |

## Setup

Requires Node.js 18 or later.

```bash
cp .env.example .env   # then fill in your keys
npm install
npm start              # http://localhost:3000
```

### Environment variables

| Name | Used for |
| --- | --- |
| `RAPIDAPI_KEY` | Google Flights and Sky-Scrapper (shared) |
| `FLIGHTAPI_KEY` | FlightAPI.io |
| `AVIATIONSTACK_KEY` | Flight tracking |
| `PORT` | Local server port (default 3000) |

Never commit `.env`. In production, set these in the Vercel project settings.

## Deployment

Pushing to `main` deploys to Vercel. `api/index.js` exposes the Express app as a serverless function; `index.html` and `image.png` are served statically. Security headers are set in `vercel.json`.

## Project layout

- `server.js`: Express backend, provider adapters, routes
- `visaData.js`: static visa data
- `index.html`: the whole frontend (inline CSS and JS, no build step)
- `api/index.js`: Vercel entry
