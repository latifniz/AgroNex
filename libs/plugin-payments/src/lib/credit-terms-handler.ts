import { PaymentMethodHandler, LanguageCode } from '@vendure/core';

export const creditTermsHandler = new PaymentMethodHandler({
  code: 'credit-terms',
  description: [
    { languageCode: LanguageCode.en, value: 'Pay on Credit Terms' },
  ],
  args: {
    days: {
      type: 'int',
      defaultValue: 30,
      label: [{ languageCode: LanguageCode.en, value: 'Credit days' }],
    },
  },
  createPayment: (ctx, order, amount, args) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + args.days);
    return {
      amount,
      state: 'Authorized' as const,
      transactionId: `CREDIT-${order.code}`,
      metadata: {
        creditDays: args.days,
        dueDate: dueDate.toISOString().split('T')[0],
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
