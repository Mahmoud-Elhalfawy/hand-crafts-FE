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

## Deploy on Netlify

This repo includes `netlify.toml`.

Netlify settings:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: configured to serve `index.html`
- WhatsApp number: `201006964936`

If deploying from the Netlify dashboard, connect this repository and select the frontend repo root.

## Backend API

The frontend can run without a backend because products are bundled in the app and orders go through WhatsApp.

If you deploy the optional Quarkus backend later, set its URL with:

```bash
VITE_API_BASE_URL=https://your-api.example.com npm run dev
```

Do not set `VITE_API_BASE_URL` to `localhost` on Netlify; mobile visitors cannot reach your local computer.

## WhatsApp orders

Product detail pages send pre-filled order requests to `+201006964936` by default.

Set a different WhatsApp number with:

```bash
VITE_WHATSAPP_NUMBER=201006964936 npm run dev
```

Use the full international number without `+`, spaces, or dashes. The product detail page shows an "Order on WhatsApp" button with a pre-filled product request message that includes the product name, category, product code, and product image URL.

## Product photos

Product image assets live in `public/products`.

To replace them with the real product photos, keep the same filenames or update each product's `imageUrl` in the frontend fallback data and backend catalog.
