import { LanguageCode, ShippingCalculator } from '@vendure/core';

export const flatRateCalculator = new ShippingCalculator({
  code: 'flat-rate-calculator',
  description: [
    { languageCode: LanguageCode.en, value: 'Flat Rate Calculator' },
  ],
  args: {
    rate: {
      type: 'int',
      defaultValue: 500,
      label: [{ languageCode: LanguageCode.en, value: 'Flat rate (in cents)' }],
    },
  },

  calculate: (ctx, order, args) => {
    return {
      price: args.rate,
      taxRate: 0,
      priceIncludesTax: false,
    };
  },
});
