import { defineDashboardExtension, api } from '@vendure/dashboard';
import { graphql } from '@/gql';

const lowStockQuery = graphql(`
  query LowStockVariants {
    lowStockVariants {
      id
      productName
      variantName
      stockOnHand
      stockAllocated
      threshold
    }
  }
`);

type LowStockData = {
  lowStockVariants: Array<{
    id: string;
    productName: string;
    variantName: string;
    stockOnHand: number;
    stockAllocated: number;
    threshold: number;
  }>;
};

export default defineDashboardExtension({
  alerts: [
    {
      id: 'low-stock-alert',
      title: (data: LowStockData) => {
        const count = data?.lowStockVariants?.length ?? 0;
        return count === 1
          ? '1 variant is low on stock'
          : `${count} variants are low on stock`;
      },
      description: (data: LowStockData) =>
        data?.lowStockVariants
          ?.map(
            v =>
              `${v.productName} (${v.variantName}): ${v.stockOnHand} remaining`,
          )
          .join(', ') ?? '',
      severity: (data: LowStockData) => {
        const hasOutOfStock = data?.lowStockVariants?.some(
          v => v.stockOnHand - v.stockAllocated <= 0,
        );
        return hasOutOfStock ? 'error' : 'warning';
      },

      recheckInterval: 60 * 5 * 1000, // 5 minutes
      check: async () => {
        return api.query(lowStockQuery) as Promise<LowStockData>;
      },
      shouldShow: (data: LowStockData) =>
        (data?.lowStockVariants?.length ?? 0) > 0,
    },
  ],
});
