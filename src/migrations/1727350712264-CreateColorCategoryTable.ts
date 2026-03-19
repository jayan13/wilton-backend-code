import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateColorCategoryTable1727350712264
  implements MigrationInterface
{
  name = 'CreateColorCategoryTable1727350712264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "color-category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "colorCode" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "createdBy" uuid, CONSTRAINT "UQ_4c747701731e580edc18037fa98" UNIQUE ("name"), CONSTRAINT "PK_d1bf54a55532303085b2d9c23ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "color-category" ADD CONSTRAINT "FK_d756bb331e4117813939a933619" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "color-category" DROP CONSTRAINT "FK_d756bb331e4117813939a933619"`,
    );
    await queryRunner.query(`DROP TABLE "color-category"`);
  }
}
