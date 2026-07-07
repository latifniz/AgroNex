import {MigrationInterface, QueryRunner} from "typeorm";

export class MOQ1783357991264 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsMinorderquantity" integer DEFAULT '0'`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsMinorderquantity"`, undefined);
   }

}
