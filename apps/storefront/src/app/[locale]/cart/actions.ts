'use server';

import {mutate} from '@/lib/vendure/api';
import {
    RemoveFromCartMutation,
    AdjustCartItemMutation,
    ApplyPromotionCodeMutation,
    RemovePromotionCodeMutation
} from '@/lib/vendure/mutations';
import {getActiveCurrencyCode} from '@/lib/currency-server';
import {updateTag} from 'next/cache';
import {getChannelToken} from '@/lib/channel';

export async function removeFromCart(lineId: string) {
    const currencyCode = await getActiveCurrencyCode();
    const channelToken = (await getChannelToken()) ?? undefined;
    await mutate(RemoveFromCartMutation, {lineId}, {useAuthToken: true, currencyCode, channelToken});
    updateTag('cart');
}

export async function adjustQuantity(lineId: string, quantity: number) {
    const currencyCode = await getActiveCurrencyCode();
    const channelToken = (await getChannelToken()) ?? undefined;
    const result = await mutate(AdjustCartItemMutation, {lineId, quantity}, {useAuthToken: true, currencyCode, channelToken});
    updateTag('cart');

    const response = result.data.adjustOrderLine;
    if (response.__typename === 'InsufficientStockError') {
        return { insufficientStock: true, quantityAvailable: response.quantityAvailable };
    }
    return { insufficientStock: false };
}

export async function applyPromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    const currencyCode = await getActiveCurrencyCode();
    const channelToken = (await getChannelToken()) ?? undefined;
    await mutate(ApplyPromotionCodeMutation, {couponCode: code}, {useAuthToken: true, currencyCode, channelToken});
    updateTag('cart');
}

export async function removePromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    const currencyCode = await getActiveCurrencyCode();
    const channelToken = (await getChannelToken()) ?? undefined;
    await mutate(RemovePromotionCodeMutation, {couponCode: code}, {useAuthToken: true, currencyCode, channelToken});
    updateTag('cart');
}
