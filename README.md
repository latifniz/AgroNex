

# ElectroHub - Vendure Nx E-Commerce Monorepo

**ElectroHub** is a medium-size electronics e-commerce store built with [Vendure](https://www.vendure.io), a headless commerce framework.
This Nx-integrated monorepo combines the power of Vendure with custom plugins, a React-based admin dashboard, and a Next.js storefront to create a production-ready e-commerce platform.

---

## 🏗 Monorepo Structure

The repository follows the [Nx integrated repo](https://nx.dev/getting-started/integrated-repo-tutorial) structure:

### **Apps**

1. **server**
   Vendure HTTP server serving both **admin API** and **shop API**. This is the core of your e-commerce platform.

2. **worker**
   Background job processor (powered by BullMQ) for tasks like sending emails, generating invoices, or processing orders asynchronously.

3. **admin-dashboard**
   React-based admin UI built with Vite and [`@vendure/dashboard`](https://www.vendure.io/docs/guides/dashboard/). Manage products, orders, customers, and more.

4. **storefront**
   Next.js-based storefront (optional) showing products, collections, and handling customer checkout. Fully customizable and can be extended with your own UI.

### **Libs**

* **util-config**: Centralized Vendure configuration used by the server and worker.
* **util-testing**: Utilities for end-to-end testing.
* **plugin-***: Vendure plugins created as Nx libs. Extend core functionality (custom fields, workflows, integrations).

### **Other Directories**

* **static**: Static assets like email templates or default images.
* **tools**: Nx executors and generators for plugins, code generation, and build tasks.

---

## 🛠 Tech Stack

* **Backend / E-commerce:** Vendure (NestJS, GraphQL, Plugins)
* **Frontend:** Next.js (storefront, optional)
* **Database:** PostgreSQL (production) / SQLite (dev)
* **Tools:** Node.js, Nx workspace, npm

---

## 📦 Features

* Product catalog with **variants** and **attributes**
* Collections & facets (filters)
* Inventory management (stock locations & levels)
* Order lifecycle simulation (cart → payment → fulfillment)
* Customer management & addresses
* Custom fields for electronics (e.g., warranty, battery capacity)
* Plugins for business logic (e.g., warranty notifications, high-value order alerts)
* Multi-channel support (Pakistan, UAE, Wholesale)
* Shipping & payment workflow simulation

---

## 🚀 Development Setup

1. **Clone the repository**:

```bash
git clone https://github.com/latifniz/electrohub-vendure.git
cd electrohub-vendure
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure environment variables**:

```bash
cp .env.example .env
```

Set connection details for Postgres, Redis, and optionally MinIO.

4. **Start services**:

```bash
docker-compose up -d
```

5. **Populate database**:

```bash
npm run db:populate
```

6. **Run development servers**:

```bash
npm run dev          # Server + Worker
npm run dev:dashboard # Admin dashboard
npm run dev:storefront # Optional storefront
```

7. Open Admin UI: [http://localhost:3000/admin](http://localhost:3000/admin)
   Login: `admin@vendure.io` / `superadmin`

---

### Optional Commands

* `npm run dev:server` → Only start the server
* `npm run dev:worker` → Only start the worker
* `npm run dev:dashboard` → Hot-reload dashboard
* `npm run dev:storefront` → Start storefront

---

## ⚡ Database Migrations

To create migrations after modifying entities or plugins:

```bash
npx nx run server:migration <migration-name>
```

Migrations are stored in: `apps/server/migrations`
Commit migration files to source control for production deploys.

---

## 🔌 Extending Vendure

* **Plugins:** Add new functionality via Nx libs.
* **Custom entities:** Extend database schema for electronics-specific data.
* **Event hooks & workflows:** Implement custom order, shipping, or payment logic.
* **Resolvers:** Add custom GraphQL API endpoints.

Example generator:

```bash
nx g vendure-nx:vendure-plugin-generator --name=WarrantyPlugin --uiExtension=true
```

---

## 📸 Screenshots / Demo

*(Add screenshots of Admin UI, storefront pages, product catalog, etc.)*

---

## 🎯 Learning Goals

* Master Vendure architecture (Server, Admin UI, GraphQL API)
* Build realistic product catalogs with variants
* Manage inventory and orders
* Extend Vendure with custom fields, plugins, and workflows
* Learn multi-channel commerce
* Integrate shipping & payment workflows

---

## 🔗 Resources

* [Vendure Documentation](https://www.vendure.io/docs/)
* [Vendure GitHub](https://github.com/vendurehq/vendure)
* [Next.js](https://nextjs.org/)

---

## ⚡ Roadmap

1. Core setup & first products
2. Real product catalog (variants, collections, filters)
3. Inventory management
4. Orders & customers
5. Custom fields
6. Plugins (warranty, notifications)
7. Multi-channel commerce
8. External integrations (shipping, payment, ERP simulation)

---

## 📄 License

MIT License

