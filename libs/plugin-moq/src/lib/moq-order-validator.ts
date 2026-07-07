import {
  Injector,
  Order,
  OrderInterceptor,
  OrderLine,
  RequestContext,
  WillAddItemToOrderInput,
  WillAdjustOrderLineInput,
  ProductVariant,
} from '@vendure/core';

declare module '@vendure/core/dist/entity/custom-entity-fields' {
  interface CustomProductVariantFields {
    minOrderQuantity?: number;
  }
}

export class MoqOrderInterceptor implements OrderInterceptor {
  willAddItemToOrder(
    ctx: RequestContext,
    order: Order,
    input: WillAddItemToOrderInput,
  ): string | void {
    if (ctx.channel.code !== 'wholesale') return;
    return this.checkMoq(input.productVariant, input.quantity);
  }

  willAdjustOrderLine(
    ctx: RequestContext,
    order: Order,
    input: WillAdjustOrderLineInput,
  ): string | void {
    if (ctx.channel.code !== 'wholesale') return;
    return this.checkMoq(input.orderLine.productVariant, input.quantity);
  }

  private checkMoq(variant: ProductVariant, quantity: number): string | void {
    const moq = variant.customFields?.minOrderQuantity;
    if (!moq || moq <= 0) return;
    if (quantity < moq) {
      return `Minimum order quantity is ${moq} units`;
    }
  }
}
