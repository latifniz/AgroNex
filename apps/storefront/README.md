# AgroNex Storefront

Next.js 15 storefront for the AgroNex B2B agri-commerce platform.

**Live:** https://agronex-store.vercel.app/en

---

## Features

- Product catalog with faceted search (crop type, category, season)
- Multi-channel (retail / wholesale) — channel persisted in cookie
- Multi-language (English + German via next-intl)
- Multi-currency (USD + PKR)
- Cart and multi-step checkout
- Customer accounts, order history, address management
- MOQ (minimum order quantity) badge and enforcement on wholesale channel
- Contact page with phone, email, LinkedIn
- Dark / light theme

## Local Development

```bash
# From repo root
cd apps/storefront
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

Requires the Vendure server running on `localhost:3000` (see root README for full setup).

## Environment Variables

| Variable | Description |
|---|---|
| `VENDURE_SHOP_API_URL` | Shop API URL (server-side) |
| `VENDURE_CHANNEL_TOKEN` | Vendure channel token |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO/metadata |
| `NEXT_PUBLIC_SITE_NAME` | Site name (default: AgroNex) |
| `NEXT_PUBLIC_DASHBOARD_URL` | Admin dashboard URL (shows "Dashboard" link in navbar) |
| `REVALIDATION_SECRET` | Secret for `/api/revalidate` cache purge endpoint |
