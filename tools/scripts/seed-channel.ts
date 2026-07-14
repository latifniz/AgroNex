/**
 * Seed a Vendure channel with 12 demo agri products (PKR pricing).
 *
 * REQUIREMENTS:
 *   1. The Vendure server must be running (npm run dev:server)
 *   2. The target channel must already exist in the admin panel
 *   3. Run initial data seed first if tax categories don't exist (npm run db:populate)
 *
 * USAGE:
 *   npm run seed:channel -- --channel=agrimoves-token --password=<superadmin-password>
 *
 * OPTIONS:
 *   --channel    Channel token (required)
 *   --username   Superadmin username  (default: superadmin)
 *   --password   Superadmin password  (default: admin)
 *   --server     Vendure server URL   (default: http://localhost:3000)
 *
 * PRICES:
 *   Stored in paisa (PKR × 100) because Vendure uses fractionDigits=2 for PKR.
 *   e.g. 4,200 PKR is stored as 420000.
 *
 * NOTE:
 *   Make sure the agrimoves channel has PKR set as its default currency in the
 *   admin panel (Settings → Channels → edit channel → Default Currency Code: PKR).
 */

import * as fs from 'fs';
import * as path from 'path';

// Load .env from repo root
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const argv = process.argv.slice(2);
const arg = (name: string, def = '') => {
  const found = argv.find(a => a.startsWith(`--${name}=`));
  return found ? found.slice(`--${name}=`.length) : def;
};

const CHANNEL_TOKEN = arg('channel');
const USERNAME      = arg('username', process.env['SUPERADMIN_IDENTIFIER'] ?? 'superadmin');
const PASSWORD      = arg('password', process.env['SUPERADMIN_PASSWORD']   ?? 'superadmin');
const SERVER        = arg('server',   process.env['API_PUBLIC_URL'] ? `${process.env['API_PUBLIC_URL']}:${process.env['API_INTERNAL_PORT'] ?? '3000'}` : 'http://localhost:3000');
const ADMIN_API     = `${SERVER}/admin-api`;

if (!CHANNEL_TOKEN) {
  console.error('❌  --channel=<token> is required.\n    Example: --channel=agrimoves-token');
  process.exit(1);
}

// ─── GraphQL client ────────────────────────────────────────────────────────────

let cookie = '';

async function gql<T = any>(
  query: string,
  variables: object = {},
  channelToken: string = CHANNEL_TOKEN,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  if (channelToken) headers['vendure-token'] = channelToken;

  const res = await fetch(ADMIN_API, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const sc = res.headers.get('set-cookie');
  if (sc) cookie = sc.split(';')[0];

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join(' | '));
  }
  return json.data as T;
}

// ─── Collections ──────────────────────────────────────────────────────────────

const COLLECTIONS = [
  { code: 'fertilizers',    name: 'Fertilizers',             description: 'Macro and secondary plant nutrients for all major crops.' },
  { code: 'seeds',          name: 'Seeds',                   description: 'Certified high-yielding seed varieties for Pakistan.' },
  { code: 'pesticides',     name: 'Pesticides & Fungicides', description: 'Insecticides and fungicides for crop protection.' },
  { code: 'equipment',      name: 'Farm Equipment',          description: 'Sprayers and field application tools.' },
  { code: 'micronutrients', name: 'Micronutrients',          description: 'Trace elements and micronutrient supplements.' },
];

// ─── Products ─────────────────────────────────────────────────────────────────
// Prices in paisa (PKR × 100).  e.g. 4200 PKR → 420000

interface Variant { size: string; sku: string; price: number; stock: number }
interface Product  { name: string; slug: string; description: string; collection: string; variants: Variant[] }

const PRODUCTS: Product[] = [
  // ── Fertilizers ─────────────────────────────────────────────────────────
  {
    name: 'DAP Fertilizer', slug: 'dap-fertilizer',
    description: 'Di-Ammonium Phosphate (DAP) — 18% N + 46% P₂O₅. Applied at sowing for wheat, cotton, and rice. Promotes strong root development and early plant growth.',
    collection: 'fertilizers',
    variants: [
      { size: '10 KG', sku: 'AM-DAP-10KG', price:  420000, stock: 500 },
      { size: '25 KG', sku: 'AM-DAP-25KG', price:  850000, stock: 300 },
      { size: '50 KG', sku: 'AM-DAP-50KG', price: 1680000, stock: 150 },
    ],
  },
  {
    name: 'Urea Fertilizer', slug: 'urea-fertilizer',
    description: 'Granular urea with 46% nitrogen — highest content in any solid fertilizer. Ideal for top-dressing on wheat, cotton, and sugarcane. Fast-acting, suitable for all crops.',
    collection: 'fertilizers',
    variants: [
      { size: '10 KG', sku: 'AM-UREA-10KG', price: 210000, stock: 800 },
      { size: '25 KG', sku: 'AM-UREA-25KG', price: 450000, stock: 400 },
      { size: '50 KG', sku: 'AM-UREA-50KG', price: 880000, stock: 200 },
    ],
  },
  {
    name: 'NPK 20-20-20 Fertilizer', slug: 'npk-20-20-20',
    description: 'Balanced water-soluble NPK for foliar spray and fertigation. Equal N-P-K ratio promotes balanced vegetative and reproductive growth throughout the season.',
    collection: 'fertilizers',
    variants: [
      { size: '5 KG',  sku: 'AM-NPK-5KG',  price:  250000, stock: 200 },
      { size: '10 KG', sku: 'AM-NPK-10KG', price:  480000, stock: 100 },
      { size: '25 KG', sku: 'AM-NPK-25KG', price: 1150000, stock:  50 },
    ],
  },

  // ── Seeds ────────────────────────────────────────────────────────────────
  {
    name: 'Wheat Seed Akbar-19', slug: 'wheat-seed-akbar-19',
    description: 'Punjab Seed Council approved rust-resistant wheat. Average yield 45–55 maunds/acre. Short duration, ideal for all irrigated wheat zones of Pakistan.',
    collection: 'seeds',
    variants: [
      { size: '5 KG',  sku: 'AM-WSAK-5KG',  price: 150000, stock: 300 },
      { size: '10 KG', sku: 'AM-WSAK-10KG', price: 280000, stock: 150 },
      { size: '25 KG', sku: 'AM-WSAK-25KG', price: 650000, stock:  75 },
    ],
  },
  {
    name: 'Super Basmati Rice Seed', slug: 'super-basmati-rice-seed',
    description: 'Premium long-grain aromatic basmati from Rice Research Institute, Kala Shah Kaku. Yield 25–35 maunds/acre. Commands export-premium prices in international markets.',
    collection: 'seeds',
    variants: [
      { size: '5 KG',  sku: 'AM-SBR-5KG',  price: 120000, stock: 300 },
      { size: '10 KG', sku: 'AM-SBR-10KG', price: 220000, stock: 150 },
      { size: '25 KG', sku: 'AM-SBR-25KG', price: 520000, stock:  75 },
    ],
  },
  {
    name: 'Cotton Seed IUB-2013', slug: 'cotton-seed-iub-2013',
    description: 'Non-Bt cotton with high ginning outturn (38–40%) and medium-staple fibre. Kharif season, 160–180 day maturity. Suited for sandy loam soils of Punjab and Sindh.',
    collection: 'seeds',
    variants: [
      { size: '450 G',  sku: 'AM-CS-450G', price: 180000, stock: 400 },
      { size: '900 G',  sku: 'AM-CS-900G', price: 340000, stock: 200 },
      { size: '1.8 KG', sku: 'AM-CS-1P8K', price: 650000, stock: 100 },
    ],
  },

  // ── Pesticides & Fungicides ───────────────────────────────────────────────
  {
    name: 'Lambda-Cyhalothrin 2.5 EC', slug: 'lambda-cyhalothrin-2-5-ec',
    description: 'Broad-spectrum pyrethroid for fast knockdown of whitefly, thrips, aphids, armyworm, and bollworms. Long residual activity on cotton, wheat, and vegetables.',
    collection: 'pesticides',
    variants: [
      { size: '100 ML', sku: 'AM-LAMCY-100ML', price:  85000, stock: 400 },
      { size: '250 ML', sku: 'AM-LAMCY-250ML', price: 180000, stock: 200 },
      { size: '500 ML', sku: 'AM-LAMCY-500ML', price: 340000, stock: 100 },
    ],
  },
  {
    name: 'Imidacloprid 200 SL', slug: 'imidacloprid-200-sl',
    description: 'Systemic neonicotinoid for whitefly, aphids, thrips, and leafhoppers. Absorbed through roots and leaves, protecting new growth. Suitable for seed treatment and foliar spray.',
    collection: 'pesticides',
    variants: [
      { size: '100 ML', sku: 'AM-IMD-100ML', price: 110000, stock: 400 },
      { size: '250 ML', sku: 'AM-IMD-250ML', price: 250000, stock: 200 },
      { size: '500 ML', sku: 'AM-IMD-500ML', price: 480000, stock: 100 },
    ],
  },
  {
    name: 'Carbendazim 50 WP Fungicide', slug: 'carbendazim-50-wp',
    description: 'Systemic fungicide for powdery mildew, loose smut, and sheath blight in wheat and rice. Controls die-back and leaf spot in vegetables. Apply as foliar spray or seed treatment.',
    collection: 'pesticides',
    variants: [
      { size: '100 G', sku: 'AM-CARB-100G', price:  60000, stock: 400 },
      { size: '250 G', sku: 'AM-CARB-250G', price: 140000, stock: 200 },
      { size: '500 G', sku: 'AM-CARB-500G', price: 260000, stock: 100 },
    ],
  },

  // ── Equipment ────────────────────────────────────────────────────────────
  {
    name: 'Knapsack Sprayer', slug: 'knapsack-sprayer',
    description: 'Heavy-duty manual knapsack sprayer with adjustable brass nozzle, chemical-resistant tank, and pressure relief valve. Includes flat-fan, cone, and hollow-cone nozzle tips.',
    collection: 'equipment',
    variants: [
      { size: '12 Litre', sku: 'AM-SPR-12L', price:  420000, stock: 50 },
      { size: '16 Litre', sku: 'AM-SPR-16L', price:  750000, stock: 30 },
      { size: '20 Litre', sku: 'AM-SPR-20L', price: 1050000, stock: 20 },
    ],
  },

  // ── Micronutrients ───────────────────────────────────────────────────────
  {
    name: 'Zinc Sulphate 33%', slug: 'zinc-sulphate-33',
    description: 'Granular zinc sulphate for correcting zinc deficiency — the most common micronutrient problem in Pakistan soils. Improves grain filling and overall plant vigour.',
    collection: 'micronutrients',
    variants: [
      { size: '500 G', sku: 'AM-ZN-500G', price:  45000, stock: 500 },
      { size: '1 KG',  sku: 'AM-ZN-1KG',  price:  85000, stock: 300 },
      { size: '5 KG',  sku: 'AM-ZN-5KG',  price: 380000, stock: 100 },
    ],
  },
  {
    name: 'Boron 20% Micronutrient', slug: 'boron-20',
    description: 'Soluble boron for correcting deficiency in calcareous soils. Critical for cotton boll set, wheat grain fill, and fruit pollination. Apply 150–200 g/acre as foliar spray.',
    collection: 'micronutrients',
    variants: [
      { size: '250 G', sku: 'AM-BOR-250G', price:  60000, stock: 400 },
      { size: '500 G', sku: 'AM-BOR-500G', price: 110000, stock: 200 },
      { size: '1 KG',  sku: 'AM-BOR-1KG',  price: 210000, stock: 100 },
    ],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌱  Seeding channel: ${CHANNEL_TOKEN}`);
  console.log(`    Server: ${SERVER}\n`);

  // 1. Login — use no channel token so superadmin creds always work
  console.log('🔑  Logging in...');
  const loginResult = await gql<{ login: { __typename: string; id?: string; identifier?: string; message?: string } }>(
    `mutation Login($u: String!, $p: String!) {
       login(username: $u, password: $p) {
         __typename
         ... on CurrentUser { id identifier }
         ... on InvalidCredentialsError { message }
         ... on NotVerifiedError { message }
       }
     }`,
    { u: USERNAME, p: PASSWORD },
    '', // no channel token
  );
  if (loginResult.login.__typename !== 'CurrentUser') {
    throw new Error(`Login failed: ${loginResult.login.message}`);
  }
  console.log(`   ✅ Logged in as ${loginResult.login.identifier}\n`);

  // 2. Get tax category (global — not channel scoped)
  console.log('💰  Finding tax category...');
  const { taxCategories } = await gql<{ taxCategories: { items: { id: string; name: string }[] } }>(
    `query { taxCategories { items { id name } } }`,
  );
  const taxCat = taxCategories.items.find(t => t.name.toLowerCase().includes('standard'))
    ?? taxCategories.items[0];
  if (!taxCat) {
    throw new Error('No tax categories found. Run "npm run db:populate" first to seed initial data.');
  }
  console.log(`   ✅ Tax category: "${taxCat.name}" (${taxCat.id})\n`);

  // 3. Get or create stock location in this channel
  console.log('📦  Finding stock location...');
  const { stockLocations } = await gql<{ stockLocations: { items: { id: string; name: string }[] } }>(
    `query { stockLocations { items { id name } } }`,
  );
  let stockLocationId: string;
  if (stockLocations.items.length > 0) {
    stockLocationId = stockLocations.items[0].id;
    console.log(`   ✅ Using: "${stockLocations.items[0].name}" (${stockLocationId})\n`);
  } else {
    const { createStockLocation } = await gql<{ createStockLocation: { id: string; name: string } }>(
      `mutation CreateSL($input: CreateStockLocationInput!) {
         createStockLocation(input: $input) { id name }
       }`,
      { input: { name: 'Main Warehouse' } },
    );
    stockLocationId = createStockLocation.id;
    console.log(`   ✅ Created: "${createStockLocation.name}" (${stockLocationId})\n`);
  }

  // 4. Create category facet with 5 values
  console.log('🏷️   Creating category facet...');
  const { createFacet } = await gql<{ createFacet: { id: string; values: { id: string; code: string }[] } }>(
    `mutation CreateFacet($input: CreateFacetInput!) {
       createFacet(input: $input) {
         id
         values { id code }
       }
     }`,
    {
      input: {
        code: 'category',
        isPrivate: false,
        translations: [{ languageCode: 'en', name: 'Category' }],
        values: COLLECTIONS.map(c => ({
          code: c.code,
          translations: [{ languageCode: 'en', name: c.name }],
        })),
      },
    },
  );
  const facetValueMap: Record<string, string> = Object.fromEntries(
    createFacet.values.map(v => [v.code, v.id]),
  );
  console.log(`   ✅ Created facet with ${createFacet.values.length} values\n`);

  // 5. Create collections
  console.log('📁  Creating collections...');
  for (const col of COLLECTIONS) {
    await gql(
      `mutation CreateCollection($input: CreateCollectionInput!) {
         createCollection(input: $input) { id slug }
       }`,
      {
        input: {
          isPrivate: false,
          translations: [{
            languageCode: 'en',
            name: col.name,
            slug: col.code,
            description: col.description,
          }],
          filters: [{
            code: 'facet-value-filter',
            arguments: [
              { name: 'facetValueIds', value: JSON.stringify([facetValueMap[col.code]]) },
              { name: 'containsAny',   value: 'false' },
            ],
          }],
        },
      },
    );
    console.log(`   ✅ ${col.name}`);
  }

  // 6. Create products with option groups and variants
  console.log('\n🌾  Creating products...');
  for (const product of PRODUCTS) {
    process.stdout.write(`   ➕ ${product.name}...`);

    // Create product
    const { createProduct } = await gql<{ createProduct: { id: string } }>(
      `mutation CreateProduct($input: CreateProductInput!) {
         createProduct(input: $input) { id }
       }`,
      {
        input: {
          translations: [{
            languageCode: 'en',
            name: product.name,
            slug: product.slug,
            description: product.description,
          }],
          facetValueIds: [facetValueMap[product.collection]],
        },
      },
    );

    // Create option group (Size) with one option per variant
    const { createProductOptionGroup } = await gql<{
      createProductOptionGroup: { id: string; options: { id: string; code: string }[] }
    }>(
      `mutation CreateOptionGroup($input: CreateProductOptionGroupInput!) {
         createProductOptionGroup(input: $input) {
           id options { id code }
         }
       }`,
      {
        input: {
          code: `${product.slug}-size`,
          translations: [{ languageCode: 'en', name: 'Size' }],
          options: product.variants.map(v => ({
            code: v.size.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
            translations: [{ languageCode: 'en', name: v.size }],
          })),
        },
      },
    );

    // Link option group to product
    await gql(
      `mutation AddGroup($productId: ID!, $groupId: ID!) {
         addOptionGroupToProduct(productId: $productId, optionGroupId: $groupId) { id }
       }`,
      { productId: createProduct.id, groupId: createProductOptionGroup.id },
    );

    // Create all 3 variants
    await gql(
      `mutation CreateVariants($input: [CreateProductVariantInput!]!) {
         createProductVariants(input: $input) { id sku }
       }`,
      {
        input: product.variants.map((v, i) => ({
          productId: createProduct.id,
          sku: v.sku,
          price: v.price,
          taxCategoryId: taxCat.id,
          trackInventory: 'FALSE',
          stockLevels: [{ stockLocationId, stockOnHand: v.stock }],
          translations: [{ languageCode: 'en', name: `${product.name} ${v.size}` }],
          optionIds: [createProductOptionGroup.options[i].id],
        })),
      },
    );

    console.log(' ✅');
  }

  console.log(`
✅  Done! ${PRODUCTS.length} products (${PRODUCTS.length * 3} variants) created in "${CHANNEL_TOKEN}".

Next steps:
  1. In admin: Catalog → Run collection filters to index products into collections
  2. In admin: Settings → Channels → confirm channel currency is PKR
  3. Run reindex job if products don't show on storefront
`);
}

main().catch(err => {
  console.error('\n❌  Seed failed:', err.message);
  process.exit(1);
});
