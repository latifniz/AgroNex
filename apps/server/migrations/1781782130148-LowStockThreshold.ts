import {MigrationInterface, QueryRunner} from "typeorm";

export class LowStockThreshold1781782130148 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsLowstockthreshold" integer DEFAULT '0'`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsLowstockthreshold"`, undefined);
   }

}
