import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDesignTable1727354549020 implements MigrationInterface {
  name = 'UpdateDesignTable1727354549020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "designs" ADD "designNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "designs" ADD "productConstruction" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "designs" ADD "picksMtr" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "designs" ADD "pileType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "designs" ADD "repeatSize" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "designs" DROP COLUMN "repeatSize"`);
    await queryRunner.query(`ALTER TABLE "designs" DROP COLUMN "pileType"`);
    await queryRunner.query(`ALTER TABLE "designs" DROP COLUMN "picksMtr"`);
    await queryRunner.query(
      `ALTER TABLE "designs" DROP COLUMN "productConstruction"`,
    );
    await queryRunner.query(`ALTER TABLE "designs" DROP COLUMN "designNumber"`);
  }
}
