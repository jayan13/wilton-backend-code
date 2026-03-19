import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsDeletedFieldInUserTable1675063462992
  implements MigrationInterface
{
  name = 'addIsDeletedFieldInUserTable1675063462992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isDeleted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isDeleted"`);
  }
}
