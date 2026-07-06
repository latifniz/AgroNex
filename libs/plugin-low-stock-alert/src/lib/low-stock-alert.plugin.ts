import { LanguageCode, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { LowStockListener } from './low-stock-listener';
import { LowStockResolver } from './low-stock-resolver';
import { lowStockApiExtensions } from './low-stock-api';

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [LowStockListener, LowStockResolver],
  adminApiExtensions: {
    schema: lowStockApiExtensions,
    resolvers: [LowStockResolver],
  },
  dashboard: '../dashboard/index.tsx',
  configuration: config => {
    config.customFields.ProductVariant.push({
      name: 'lowStockThreshold',
      type: 'int',
      defaultValue: 0,
      label: [{ languageCode: LanguageCode.en, value: 'Low Stock Threshold' }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: 'Alert when stock drops below this number. Set 0 to disable.',
        },
      ],
    });
    return config;
  },
})
export class LowStockAlertPlugin {}
