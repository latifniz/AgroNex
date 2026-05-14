# AgroNex — Vendure Nx B2B Agri Commerce Monorepo

**AgroNex** is a B2B agri-input commerce platform built with [Vendure](https://www.vendure.io), a headless commerce framework.
It models how distributors and wholesalers sell agri products (seeds, fertilizers, pesticides, equipment) to dealers and retailers.
Built as an Nx integrated monorepo — primarily a deep-dive learning project for Vendure, with a structure close enough to production that it could become one.

---

## Domain Model

**Who sells what to whom:**

```
Manufacturer / Importer
       ↓
   Distributor  (AgroNex platform users — B2B sellers)
       ↓
  Sub-dealer / Retailer  (buyers on the platform)
       ↓
      Farmer
```

**Product categories:**

- Seeds (variety, pack size, crop type, season)
- Fertilizers (NPK type, weight, formulation)
- Pesticides (active ingredient, crop target, registration no.)
- Farm equipment & tools

---

## Monorepo Structure

```
apps/
  server/           # Vendure HTTP server (admin-api + shop-api)
  worker/           # BullMQ job queue worker
  admin-dashboard/  # React admin UI (@vendure/dashboard)
  storefront/       # Next.js B2B storefront (buyer portal)

libs/
  util-config/      # Shared VendureConfig (server + worker)
  util-testing/     # E2E test utilities
  plugin-*/         # Custom Vendure plugins (see below)

tools/
  executors/        # Custom Nx executors
  vendure-nx/       # Plugin scaffold generator
```

---

## Plugins (Planned)

| Plugin | Purpose |
|---|---|
| `plugin-bulk-pricing` | Tiered pricing based on order quantity |
| `plugin-credit-limit` | Per-customer credit limits for B2B |
| `plugin-min-order-qty` | Minimum order quantity per product/variant |
| `plugin-territory` | Assign distributors to geographic territories |
| `plugin-agri-fields` | Custom fields: crop suitability, season, reg. no. |

---

## Channels (Multi-store)

| Channel | Purpose |
|---|---|
| Pakistan Wholesale | Bulk pricing in PKR |
| Pakistan Retail | Standard dealer pricing |
| Export | USD pricing for cross-border |

---

## Tech Stack

- **Backend / Commerce:** Vendure v3.x (NestJS, GraphQL, TypeORM)
- **Frontend:** Next.js (buyer portal)
- **Database:** PostgreSQL (prod) / SQLite (tests)
- **Queue:** BullMQ + Redis
- **Storage:** MinIO (assets)
- **Tooling:** Nx 20, Node 22, npm

---

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Start infrastructure:**
   ```bash
   docker-compose up -d
   ```

4. **Populate database:**
   ```bash
   npm run db:populate
   ```

5. **Run development servers:**
   ```bash
   npm run dev           # Server + Worker
   npm run dev:dashboard # Admin dashboard (Vite HMR)
   ```

6. Open Admin UI: [http://localhost:3000/admin](http://localhost:3000/admin)
   Login: `admin@vendure.io` / `superadmin`

---

## Common Commands

```bash
npm run dev                        # Server + Worker
npm run dev:dashboard              # Admin dashboard
npx nx run server:migration <name> # Create migration
npx nx test server                 # Run server tests
npx nx lint server                 # Lint
nx g vendure-nx:vendure-plugin-generator --name=BulkPricing --uiExtension=true
```

---

## Updating Vendure

This project consumes Vendure as npm packages. To upgrade:

```bash
npm install @vendure/core@latest \
  @vendure/dashboard@latest \
  @vendure/email-plugin@latest \
  @vendure/job-queue-plugin@latest \
  @vendure/asset-server-plugin@latest \
  @vendure/payments-plugin@latest

# Then generate and run any required migrations
npx nx run server:migration post-upgrade
npm run dev
```

Check the [Vendure changelog](https://github.com/vendure-ecommerce/vendure/blob/master/CHANGELOG.md) before upgrading.

---

## Learning Roadmap

1. Core setup — server, admin UI, GraphQL API basics
2. Agri product catalog — variants, facets, collections
3. Inventory — stock locations (warehouse by region), stock levels
4. Orders & customers — B2B order lifecycle
5. Custom fields — crop type, season, registration numbers
6. First plugin — bulk pricing or credit limit
7. Multi-channel — wholesale vs retail pricing
8. External integrations — shipping carriers, payment gateways

---

## License

MIT
