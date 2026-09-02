# Travel Reel Map

Save travel reels (Instagram/YouTube Shorts) and pin them on an interactive map, organized by location and category.

## Features
- Paste a reel URL — Claude API infers the likely location, category, and title
- Manual entry fallback if a URL can't be parsed
- Filter by category: Food, Stay, Sightseeing
- Search by city, place, or title
- Pins persist locally via `localStorage`

## Stack
- [Leaflet.js](https://leafletjs.com/) + OpenStreetMap tiles
- Vanilla JS, no build step
- Claude API (`claude-sonnet-4-20250514`) for location extraction

## Running locally
Just open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

On first "Analyze & Pin," you'll be prompted for an  API key. It's stored only in your browser's `localStorage` — never committed or sent anywhere except directly to the Anthropic API.

## Notes
This is a portfolio/demo project — the API key prompt is fine for personal local use, but isn't a pattern for a production app (a real deployment would proxy the API call through a backend to avoid exposing a key client-side at all).
