import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDeletedAtColumn1687254491026 implements MigrationInterface {
  name = 'AddedDeletedAtColumn1687254491026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "designs" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "designs" DROP COLUMN "deletedAt"`);
  }
}
