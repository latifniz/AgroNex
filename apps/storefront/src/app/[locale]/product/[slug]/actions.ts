'use server';

import { mutate } from '@/lib/vendure/api';
import { AddToCartMutation } from '@/lib/vendure/mutations';
import { updateTag } from 'next/cache';
import { setAuthToken } from '@/lib/auth';
import { getActiveCurrencyCode } from '@/lib/currency-server';
import { getLocale, getTranslations } from 'next-intl/server';
import { getChannelToken } from '@/lib/channel';

export async function addToCart(variantId: string, quantity: number = 1) {
  const locale = await getLocale();
  const currencyCode = await getActiveCurrencyCode();
  const channelToken = (await getChannelToken()) ?? undefined;
  const t = await getTranslations({locale, namespace: 'Errors'});

  try {
    const result = await mutate(AddToCartMutation, { variantId, quantity }, { useAuthToken: true, currencyCode, channelToken });

    if (result.token) {
      await setAuthToken(result.token);
    }

    if (result.data.addItemToOrder.__typename === 'Order') {
      updateTag('cart');
      updateTag('active-order');
      return { success: true };
    } else if (result.data.addItemToOrder.__typename === 'InsufficientStockError') {
      updateTag('cart');
      updateTag('active-order');
      return { success: true, insufficientStock: true, quantityAvailable: result.data.addItemToOrder.quantityAvailable };
    } else if (result.data.addItemToOrder.__typename === 'OrderInterceptorError') {
      return { success: false, error: result.data.addItemToOrder.interceptorError };
    } else {
      return { success: false, error: result.data.addItemToOrder.message };
    }
  } catch {
    return { success: false, error: t('failedAddToCart') };
  }
}
