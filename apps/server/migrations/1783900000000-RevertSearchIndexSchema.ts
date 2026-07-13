import { MigrationInterface, QueryRunner } from 'typeorm';

export class RevertSearchIndexSchema1783900000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the 4-column PK added by the reverted migration
        await queryRunner.query(`ALTER TABLE "search_index_item" DROP CONSTRAINT IF EXISTS "PK_7a69c042bd9e9f70a1f9c6a5336"`);
        // Restore the original 3-column PK
        await queryRunner.query(`ALTER TABLE "search_index_item" ADD CONSTRAINT "PK_6470dd173311562c89e5f80b30e" PRIMARY KEY ("productVariantId", "channelId", "languageCode")`);
        // Drop the currencyCode column
        await queryRunner.query(`ALTER TABLE "search_index_item" DROP COLUMN IF EXISTS "currencyCode"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "search_index_item" ADD "currencyCode" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "search_index_item" ALTER COLUMN "currencyCode" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "search_index_item" DROP CONSTRAINT "PK_6470dd173311562c89e5f80b30e"`);
        await queryRunner.query(`ALTER TABLE "search_index_item" ADD CONSTRAINT "PK_7a69c042bd9e9f70a1f9c6a5336" PRIMARY KEY ("productVariantId", "channelId", "languageCode", "currencyCode")`);
    }
}
