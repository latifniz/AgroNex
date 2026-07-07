# AgroNex — B2B Agri Commerce Platform

A production-grade B2B agri-input commerce platform built on [Vendure](https://www.vendure.io) (headless commerce framework) as an Nx integrated monorepo.

Models how distributors sell agri products (seeds, fertilizers, pesticides, equipment) to dealers and retailers — with wholesale/retail channels, minimum order enforcement, stock alerts, and credit terms payment.

---

## What's Built

### Multi-Channel B2B Commerce
- **Retail channel** — standard prices, Cash on Delivery payment, standard shipping
- **Wholesale channel** — 20% discounted prices, Net 30/60/90 credit terms payment, self-pickup shipping
- Channel picker on storefront — user selects their channel on first visit, saved in cookie

### Custom Plugins

| Plugin | What it does |
|---|---|
| `plugin-flat-rate-shipping` | Per-channel shipping rates with eligibility checkers |
| `plugin-payments` | COD handler (retail) + Credit Terms handler with configurable Net 30/60/90 days |
| `plugin-low-stock-alert` | Configurable threshold per variant, dashboard bell notification, rechecks every 5 min |
| `plugin-moq` | Minimum Order Quantity enforced via OrderInterceptor — wholesale channel only |

### Storefront (Next.js)
- Product catalog with faceted search (category, brand, crop type)
- Channel-consistent cart and checkout — all requests scoped to active channel
- MOQ badge on product page for wholesale variants
- InsufficientStockError and OrderInterceptorError handled with specific user-facing messages
- Quantity selector with direct input for bulk orders

### Admin Dashboard
- Low stock bell alert — fires when any variant drops below its threshold
- Custom fields visible in admin: crop type, season, registration number (product), low stock threshold + MOQ (variant)

---

## Domain Model

```
Manufacturer / Importer
       ↓
   Distributor  (AgroNex platform — B2B seller)
       ↓
  Sub-dealer / Retailer  (buyers on the storefront)
       ↓
      Farmer
```

**Product categories:** Seeds · Fertilizers · Pesticides · Farm Equipment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Commerce engine | Vendure v3.6.3 (NestJS, GraphQL, TypeORM) |
| Storefront | Next.js 15 (App Router, server actions) |
| Admin UI | @vendure/dashboard (React + Vite) |
| Database | PostgreSQL 16 |
| Job queue | BullMQ + Redis 6.2 |
| Asset storage | MinIO |
| Monorepo tooling | Nx 20, Node 22, npm |

---

## Monorepo Structure

```
apps/
  server/           # Vendure HTTP server (admin-api + shop-api), port 3500
  worker/           # BullMQ job queue worker, port 3123
  admin-dashboard/  # React admin UI
  storefront/       # Next.js B2B storefront

libs/
  util-config/      # Shared VendureConfig (used by server + worker)
  util-testing/     # E2E test utilities
  plugin-flat-rate-shipping/
  plugin-payments/
  plugin-low-stock-alert/
  plugin-moq/

tools/
  executors/        # Custom Nx executors (package, codegen)
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

# 3. Start infrastructure (PostgreSQL, Redis, MinIO)
docker-compose up -d

# 4. Start server + worker
npm run dev

# 5. Start admin dashboard (separate terminal)
npm run dev:dashboard

# 6. Start storefront (separate terminal)
cd apps/storefront && npm run dev
```

**URLs:**
- Storefront: http://localhost:3001
- Admin UI: http://localhost:3500/admin
- Admin login: `admin@vendure.io` / `superadmin`
- GraphQL playground: http://localhost:3500/admin-api

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

## License

MIT
