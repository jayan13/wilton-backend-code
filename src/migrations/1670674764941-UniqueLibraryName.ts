import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueLibraryName1670674764941 implements MigrationInterface {
  name = 'UniqueLibraryName1670674764941';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "libraries" ADD CONSTRAINT "UQ_9fb3b11b4181af695b7cbf06d49" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "libraries" DROP CONSTRAINT "UQ_9fb3b11b4181af695b7cbf06d49"`,
    );
  }
}
