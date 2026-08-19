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

## WhatsApp orders

Product detail pages send pre-filled order requests to `+201006964936` by default.

Set a different WhatsApp number with:

```bash
VITE_WHATSAPP_NUMBER=201006964936 npm run dev
```

Use the full international number without `+`, spaces, or dashes. The product detail page shows an "Order on WhatsApp" button with a pre-filled product request message.

## Product photos

Product image assets live in `public/products`.

To replace them with the real product photos, keep the same filenames or update each product's `imageUrl` in the frontend fallback data and backend catalog.
