import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  EventBus,
  StockMovementEvent,
  ProductVariantService,
  StockLevelService,
  Logger,
} from '@vendure/core';

declare module '@vendure/core' {
  interface CustomProductVariantFields {
    lowStockThreshold: number;
  }
}

const loggerCtx = 'LowStockAlert';

@Injectable()
export class LowStockListener implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private productVariantService: ProductVariantService,
    private stockLevelService: StockLevelService,
  ) {}

  onModuleInit() {
    this.eventBus.ofType(StockMovementEvent).subscribe(async event => {
      const ctx = event.ctx;

      for (const movement of event.stockMovements) {
        const variant = await this.productVariantService.findOne(
          ctx,
          movement.productVariant.id,
        );
        if (!variant) continue;

        const threshold = variant.customFields.lowStockThreshold;

        if (!threshold || threshold <= 0) continue;

        const available = await this.stockLevelService.getAvailableStock(
          ctx,
          variant.id,
        );
        const stockOnHand = available.stockOnHand - available.stockAllocated;
        if (stockOnHand <= threshold) {
          Logger.warn(
            `LOW STOCK: "${variant.name}" has ${stockOnHand} units remaining (threshold: ${threshold})`,
            loggerCtx,
          );
        }
      }
    });
  }
}
