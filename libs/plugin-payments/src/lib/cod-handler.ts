import { PaymentMethodHandler, LanguageCode } from '@vendure/core';

export const codPaymentHandler = new PaymentMethodHandler({
  code: 'cod',
  description: [{ languageCode: LanguageCode.en, value: 'Cash on Delivery' }],
  args: {},
  createPayment: (ctx, order, amount) => {
    return {
      amount,
      state: 'Authorized' as const,
      transactionId: `COD-${order.code}`,
      metadata: {
        note: 'Cash to be collected on delivery',
      },
    };
  },
  settlePayment: () => {
    return { success: true };
  },
  cancelPayment: () => {
    return { success: true };
  },
});
