import {MigrationInterface, QueryRunner} from "typeorm";

export class SearchIndexCurrencyCode1783767021311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "search_index_item" ADD "currencyCode" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "search_index_item" ALTER COLUMN "currencyCode" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "search_index_item" DROP CONSTRAINT "PK_6470dd173311562c89e5f80b30e"`, undefined);
        await queryRunner.query(`ALTER TABLE "search_index_item" ADD CONSTRAINT "PK_7a69c042bd9e9f70a1f9c6a5336" PRIMARY KEY ("productVariantId", "channelId", "languageCode", "currencyCode")`, undefined);
        await queryRunner.query(`TRUNCATE TABLE "search_index_item"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "search_index_item" DROP CONSTRAINT "PK_7a69c042bd9e9f70a1f9c6a5336"`, undefined);
        await queryRunner.query(`ALTER TABLE "search_index_item" ADD CONSTRAINT "PK_6470dd173311562c89e5f80b30e" PRIMARY KEY ("productVariantId", "channelId", "languageCode")`, undefined);
        await queryRunner.query(`ALTER TABLE "search_index_item" DROP COLUMN "currencyCode"`, undefined);
    }

}
