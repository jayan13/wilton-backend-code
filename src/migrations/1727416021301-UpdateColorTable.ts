import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColorTable1727416021301 implements MigrationInterface {
  name = 'UpdateColorTable1727416021301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company_colors_color_categories_color-category" ("companyColorsId" uuid NOT NULL, "colorCategoryId" uuid NOT NULL, CONSTRAINT "PK_d7b1852a6c2fc46642b60ec8e15" PRIMARY KEY ("companyColorsId", "colorCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_963eb6237756bac976bd5c79a6" ON "company_colors_color_categories_color-category" ("companyColorsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1fd8f47e6d2b3f2fd3a977e245" ON "company_colors_color_categories_color-category" ("colorCategoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "company_colors" ADD "code" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_colors" ADD "status" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_colors_color_categories_color-category" ADD CONSTRAINT "FK_963eb6237756bac976bd5c79a6e" FOREIGN KEY ("companyColorsId") REFERENCES "company_colors"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_colors_color_categories_color-category" ADD CONSTRAINT "FK_1fd8f47e6d2b3f2fd3a977e2456" FOREIGN KEY ("colorCategoryId") REFERENCES "color-category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_colors_color_categories_color-category" DROP CONSTRAINT "FK_1fd8f47e6d2b3f2fd3a977e2456"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_colors_color_categories_color-category" DROP CONSTRAINT "FK_963eb6237756bac976bd5c79a6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_colors" DROP COLUMN "status"`,
    );
    await queryRunner.query(`ALTER TABLE "company_colors" DROP COLUMN "code"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1fd8f47e6d2b3f2fd3a977e245"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_963eb6237756bac976bd5c79a6"`,
    );
    await queryRunner.query(
      `DROP TABLE "company_colors_color_categories_color-category"`,
    );
  }
}
