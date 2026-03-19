import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLibraryTable1670667815769 implements MigrationInterface {
  name = 'CreateLibraryTable1670667815769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "libraries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "status" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_505fedfcad00a09b3734b4223de" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "libraries"`);
  }
}
