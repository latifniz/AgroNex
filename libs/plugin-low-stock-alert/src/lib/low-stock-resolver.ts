import { Resolver, Query, ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
    Ctx,
    RequestContext,
    Allow,
    Permission,
    TransactionalConnection,
    ProductVariant,
} from '@vendure/core';

@ObjectType()
export class LowStockVariant {
    @Field(() => ID)
    id!: string;

    @Field()
    productName!: string;

    @Field()
    variantName!: string;

    @Field(() => Int)
    stockOnHand!: number;

    @Field(() => Int)
    stockAllocated!: number;

    @Field(() => Int)
    threshold!: number;
}

@Resolver()
export class LowStockResolver {
    constructor(private connection: TransactionalConnection) {}

    @Query(() => [LowStockVariant])
    @Allow(Permission.ReadCatalog)
    async lowStockVariants(@Ctx() ctx: RequestContext): Promise<LowStockVariant[]> {
        return this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variant')
            .select('variant.id', 'id')
            .addSelect('variant.customFieldsLowstockthreshold', 'threshold')
            .addSelect('SUM(stockLevel.stockOnHand)', 'stockOnHand')
            .addSelect('SUM(stockLevel.stockAllocated)', 'stockAllocated')
            .addSelect('variantTranslation.name', 'variantName')
            .addSelect('productTranslation.name', 'productName')
            .innerJoin('variant.stockLevels', 'stockLevel')
            .innerJoin('variant.product', 'product')
            .innerJoin('variant.translations', 'variantTranslation', 'variantTranslation.languageCode = :lang', { lang: ctx.languageCode })
            .innerJoin('product.translations', 'productTranslation', 'productTranslation.languageCode = :lang', { lang: ctx.languageCode })
            .where('variant.customFieldsLowstockthreshold > 0')
            .andWhere('variant.deletedAt IS NULL')
            .groupBy('variant.id')
            .addGroupBy('product.id')
            .addGroupBy('variantTranslation.name')
            .addGroupBy('productTranslation.name')
            .having(
                'SUM(stockLevel.stockOnHand) - SUM(stockLevel.stockAllocated) <= variant.customFieldsLowstockthreshold',
            )
            .getRawMany<LowStockVariant>();
    }
}
