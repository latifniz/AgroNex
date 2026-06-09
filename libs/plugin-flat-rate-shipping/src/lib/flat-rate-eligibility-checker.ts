import { LanguageCode, ShippingEligibilityChecker } from '@vendure/core';

export const retailEligibilityChecker = new ShippingEligibilityChecker({
  code: 'retail-eligibility-checker',
  description: [
    { languageCode: LanguageCode.en, value: 'Retail channel only' },
  ],
  args: {},
  check: (ctx, order) => {
    return ctx.channel.code === 'retail';
  },
});

export const wholesaleEligibilityChecker = new ShippingEligibilityChecker({
  code: 'wholesale-eligibility-checker',
  description: [
    { languageCode: LanguageCode.en, value: 'Wholesale channel only' },
  ],
  args: {},
  check: (ctx, order) => {
    return ctx.channel.code === 'wholesale';
  },
});
