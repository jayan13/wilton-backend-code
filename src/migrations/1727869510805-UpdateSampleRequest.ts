import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSampleRequest1727869510805 implements MigrationInterface {
  name = 'UpdateSampleRequest1727869510805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."sample_requests_productconstruction_enum" AS ENUM('Brussels', 'Double density Brussels', 'Float', 'Double density Float', 'Sculpture Loop', 'Sculpture Cut and Loop', 'Cut and Loop', 'Full Cut')`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_requests" ADD "productConstruction" "public"."sample_requests_productconstruction_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_requests" ADD "pileType" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sample_requests" DROP COLUMN "pileType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_requests" DROP COLUMN "productConstruction"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."sample_requests_productconstruction_enum"`,
    );
  }
}
