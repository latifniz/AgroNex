import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { codPaymentHandler } from './cod-handler';
import { creditTermsHandler } from './credit-terms-handler';

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: config => {
    config.paymentOptions.paymentMethodHandlers.push(
        codPaymentHandler,
        creditTermsHandler,
    );
    return config;
  },
})
export class PaymentsPlugin {}
