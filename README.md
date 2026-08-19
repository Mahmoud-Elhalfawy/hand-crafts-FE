# Nana's Hand Crafts Frontend

React + Vite storefront starter for Nana's Hand Crafts.

## Tech stack

- React
- TypeScript
- Vite
- Plain CSS with a custom brand theme

## Run locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Backend API

By default the frontend calls the backend at `http://localhost:8080`.

Set a different API URL with:

```bash
VITE_API_BASE_URL=https://your-api.example.com npm run dev
```

The site includes fallback product data so the page still renders when the API is not running.

## Product photos

The product cards currently use branded placeholders. Replace them once real product names, descriptions, pricing, and images are available.
