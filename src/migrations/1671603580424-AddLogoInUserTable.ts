import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLogoInUserTable1671603580424 implements MigrationInterface {
  name = 'AddLogoInUserTable1671603580424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "logo" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "logo"`);
  }
}
