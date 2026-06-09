import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import {
  retailEligibilityChecker,
  wholesaleEligibilityChecker,
} from './flat-rate-eligibility-checker';
import { flatRateCalculator } from './flat-rate-calculator';

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: config => {
    config.shippingOptions.shippingEligibilityCheckers.push(
      retailEligibilityChecker,
      wholesaleEligibilityChecker,
    );
    config.shippingOptions.shippingCalculators.push(flatRateCalculator);
    return config;
  },
})
export class FlatRateShippingPlugin {}
