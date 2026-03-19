import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompanyColorTable1670787703358
  implements MigrationInterface
{
  name = 'CreateCompanyColorTable1670787703358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company_colors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "colorCode" character varying NOT NULL, "createdBy" uuid, CONSTRAINT "UQ_54124cf439bb17a6aea281a7ca2" UNIQUE ("name"), CONSTRAINT "PK_a0c535ae59df40d85c3c8dad7ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_colors" ADD CONSTRAINT "FK_193f6a7462e72a83f6ed884afc5" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_colors" DROP CONSTRAINT "FK_193f6a7462e72a83f6ed884afc5"`,
    );
    await queryRunner.query(`DROP TABLE "company_colors"`);
  }
}
