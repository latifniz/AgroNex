/* tslint:disable:no-non-null-assertion */
import {
  initialData,
  initializeE2e,
  PRODUCTS_CSV_PATH,
  TEST_SETUP_TIMEOUT_MS,
  testConfig,
} from '@vendure-nx/util-testing';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mergeConfig } from '@vendure/core';

import { FlatRateShippingPlugin } from '../lib/flat-rate-shipping.plugin';

describe('flat-rate-shipping plugin', () => {
  initializeE2e(path.join(__dirname, '__data__'));

  const { server, adminClient, shopClient } = createTestEnvironment(
    mergeConfig(testConfig(), {
      plugins: [FlatRateShippingPlugin],
      authOptions: {
        requireVerification: false,
      },
    }),
  );

  beforeAll(async () => {
    await server.init({
      initialData: {
        ...initialData,
      },
      productsCsvPath: PRODUCTS_CSV_PATH,
      customerCount: 1,
    });
    await adminClient.asSuperAdmin();
  }, TEST_SETUP_TIMEOUT_MS);

  afterAll(async () => {
    await server.destroy();
  });

  describe('test something', () => {
    it('here', async () => {
      await adminClient.asSuperAdmin();
    });
  });
});
