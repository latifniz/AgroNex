# AgroNex — B2B Agri Commerce Platform

> **Early-stage template.** Core commerce infrastructure is in place. More features (dealer onboarding, credit management, field-agent app, analytics) are actively being built.

A B2B agri-input commerce platform built on [Vendure](https://www.vendure.io) as an Nx integrated monorepo. Models how distributors sell seeds, fertilizers, pesticides, and farm equipment to dealers and retailers — with wholesale/retail channels, minimum order enforcement, stock alerts, and credit-terms payment.

---

## Live Demo

| | URL |
|---|---|
| **Storefront** | https://agronex-store.vercel.app/en |
| **Admin Dashboard** | https://agronex-admin.vercel.app/login |

**Demo credentials (read-only):** `demo` / `demo`

---

## What's Built

### Multi-Channel B2B Commerce
- **Retail channel** — standard prices, Cash on Delivery, standard shipping
- **Wholesale channel** — 20% discounted prices, Net 30/60/90 credit terms, self-pickup shipping
- Channel picker on storefront — saved in cookie across sessions

### Custom Plugins

| Plugin | What it does |
|---|---|
| `plugin-flat-rate-shipping` | Per-channel shipping rates with eligibility checkers |
| `plugin-payments` | COD handler (retail) + Credit Terms handler with configurable Net 30/60/90 days |
| `plugin-low-stock-alert` | Configurable threshold per variant, dashboard bell notification, rechecks every 5 min |
| `plugin-moq` | Minimum Order Quantity enforced via OrderInterceptor — wholesale channel only |

### Storefront (Next.js 15)
- Product catalog with faceted search (category, crop type, season)
- Channel-aware cart and checkout
- MOQ badge on product pages for wholesale
- Multi-language (English + German), multi-currency (USD + PKR)
- Contact page and homepage contact section

### Admin Dashboard
- Custom-branded (AgroNex) — Vendure upsell UI removed
- Low stock bell alert in sidebar
- Custom product fields: crop type, season, registration number
- Custom variant fields: weight, packaging type, MOQ, low stock threshold

---

## Domain Model

```
Manufacturer / Importer
       ↓
   Distributor  ← AgroNex platform (B2B seller)
       ↓
  Sub-dealer / Retailer  (storefront buyers)
       ↓
      Farmer
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Commerce engine | Vendure v3.5.4 (NestJS, GraphQL, TypeORM) |
| Storefront | Next.js 15 (App Router, PPR, `use cache`) |
| Admin UI | @vendure/dashboard (React + Vite) |
| Database | PostgreSQL 16 |
| Job queue | BullMQ + Redis 6.2 |
| Asset storage | MinIO (S3-compatible) |
| Monorepo | Nx 20, Node 22, npm |

---

## Monorepo Structure

```
apps/
  server/           # Vendure HTTP server (admin-api + shop-api)
  worker/           # BullMQ job queue worker
  admin-dashboard/  # React admin UI (custom branded)
  storefront/       # Next.js B2B storefront

libs/
  util-config/      # Shared VendureConfig (server + worker)
  util-testing/     # E2E test utilities
  plugin-flat-rate-shipping/
  plugin-payments/
  plugin-low-stock-alert/
  plugin-moq/

tools/
  executors/        # Custom Nx executors
  vendure-nx/       # Plugin scaffold generator
```

---

## Local Development

**Prerequisites:** Node 22, Docker

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set DB credentials, Redis, MinIO, and strong superadmin credentials

# 3. Start infrastructure
docker-compose up -d

# 4. Start server + worker
npm run dev

# 5. Admin dashboard (separate terminal)
npm run dev:dashboard

# 6. Storefront (separate terminal)
cd apps/storefront && npm run dev
```

| Service | URL |
|---|---|
| Storefront | http://localhost:3001 |
| Admin UI | http://localhost:5173 |
| Shop API | http://localhost:3000/shop-api |
| Admin API | http://localhost:3000/admin-api |

---

## Common Commands

```bash
npm run dev                              # Server + Worker
npm run dev:dashboard                    # Admin dashboard (Vite HMR)
npx nx run server:migration <name>       # Generate migration
npx nx test server                       # Run tests
npx nx lint server                       # Lint

# Scaffold a new plugin
nx g vendure-nx:vendure-plugin-generator --name=MyPlugin --uiExtension=true
```

---

## Contact

Built by [Abdul Latif Nizamani](https://linkedin.com/in/abdullatifniz)
— [abdullatifnizamani517@gmail.com](mailto:abdullatifnizamani517@gmail.com) · +92 319 190 2669

---

## License

MIT
