import { MigrationInterface, QueryRunner } from 'typeorm';

export class addavatar1676096304612 implements MigrationInterface {
  name = 'addavatar1676096304612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "database_file" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "data" bytea NOT NULL, CONSTRAINT "PK_6a48e4fea10786b44d274ba8175" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "avatarId" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_3e1f52ec904aed992472f2be147" UNIQUE ("avatarId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_3e1f52ec904aed992472f2be147" FOREIGN KEY ("avatarId") REFERENCES "database_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_3e1f52ec904aed992472f2be147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_3e1f52ec904aed992472f2be147"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarId"`);
    await queryRunner.query(`DROP TABLE "database_file"`);
  }
}
