import { MigrationInterface, QueryRunner } from 'typeorm';

export class addStatusInUserTable1674897576183 implements MigrationInterface {
  name = 'addStatusInUserTable1674897576183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "status" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
  }
}
