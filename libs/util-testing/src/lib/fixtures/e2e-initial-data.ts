import { LanguageCode } from '@vendure/common/lib/generated-types';
import { dummyPaymentHandler, InitialData } from '@vendure/core';

export const initialData: InitialData = {
  defaultLanguage: LanguageCode.en,
  defaultZone: 'International',
  taxRates: [
    { name: 'Standard Tax', percentage: 0 },
  ],
  shippingMethods: [
    { name: 'Standard Shipping', price: 1500 },
    { name: 'Express Shipping', price: 3500 },
  ],
  countries: [
    { name: 'Pakistan', code: 'PK', zone: 'Asia' },
    { name: 'United States of America', code: 'US', zone: 'International' },
    { name: 'United Kingdom', code: 'GB', zone: 'International' },
    { name: 'United Arab Emirates', code: 'AE', zone: 'International' },
    { name: 'Saudi Arabia', code: 'SA', zone: 'International' },
    { name: 'China', code: 'CN', zone: 'Asia' },
    { name: 'India', code: 'IN', zone: 'Asia' },
    { name: 'Canada', code: 'CA', zone: 'International' },
    { name: 'Australia', code: 'AU', zone: 'International' },
  ],
  collections: [],
  paymentMethods: [],
};
