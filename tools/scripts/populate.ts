import {
  bootstrap,
  DefaultJobQueuePlugin,
  LogLevel,
  DefaultLogger,
  mergeConfig,
  ProductService,
  RequestContextService,
} from '@vendure/core';
import { populateInitialData } from '@vendure/core/cli';
import { populate } from '@vendure/core/cli';
import { config } from '@vendure-nx/util-config';
import { initialData, PRODUCTS_CSV_PATH } from '@vendure-nx/util-testing';
import * as path from 'path';

const mergedConfig = mergeConfig(config, {
  logger: new DefaultLogger({ level: LogLevel.Verbose }),
  dbConnectionOptions: {
    synchronize: true,
    migrations: [path.join(__dirname, '../../migrations/*.js')],
  },
  plugins: (config.plugins || [])
    .filter((p: any) => {
      const name = typeof p === 'function' ? p.name : '';
      return !name.includes('BullMQ');
    })
    .concat(DefaultJobQueuePlugin),
});

async function main() {
  const app = await bootstrap(mergedConfig);

  // Always seed initial data (countries, zones, tax rates, shipping methods)
  // Safe to run multiple times — Vendure skips already-existing records
  console.log('🌍 Seeding initial data (countries, zones, tax rates)...');
  await populateInitialData(app, initialData);
  console.log('✅ Initial data seeded.');

  const productService = app.get(ProductService);
  const ctxService = app.get(RequestContextService);
  const ctx = await ctxService.create({ apiType: 'admin' });
  const { totalItems } = await productService.findAll(ctx);

  if (totalItems > 0) {
    console.log(`✅ Database already has ${totalItems} products. Skipping product population.`);
    await app.close();
    process.exit(0);
  }

  await app.close();

  // Seed products only if none exist
  console.log('📦 Seeding products...');
  await populate(() => bootstrap(mergedConfig), initialData, PRODUCTS_CSV_PATH)
    .then(app => app.close());

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
