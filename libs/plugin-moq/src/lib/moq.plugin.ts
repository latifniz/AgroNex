import { LanguageCode, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { MoqOrderInterceptor } from './moq-order-validator';

@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.customFields.ProductVariant.push({
            name: 'minOrderQuantity',
            type: 'int',
            defaultValue: 0,
            nullable: true,
            label: [{ languageCode: LanguageCode.en, value: 'Minimum Order Quantity' }],
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Minimum quantity for wholesale orders. Set 0 to disable.',
                },
            ],
        });
        config.orderOptions.orderInterceptors.push(new MoqOrderInterceptor());
        return config;
    },
    compatibility: '^3.0.0',
})
export class MoqPlugin {}
