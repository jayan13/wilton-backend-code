import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedOrderInColorCategory1729585941432
  implements MigrationInterface
{
  name = 'addedOrderInColorCategory1729585941432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "color-category" ADD "order" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "color-category" DROP COLUMN "order"`);
  }
}
