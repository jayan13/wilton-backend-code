import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLibrary1670674093515 implements MigrationInterface {
  name = 'UpdateLibrary1670674093515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "libraries" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "libraries" ALTER COLUMN "status" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "libraries" ADD CONSTRAINT "FK_484c784858c0e645b92053d6f96" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "libraries" DROP CONSTRAINT "FK_484c784858c0e645b92053d6f96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "libraries" ALTER COLUMN "status" SET DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "libraries" DROP COLUMN "createdBy"`);
  }
}
