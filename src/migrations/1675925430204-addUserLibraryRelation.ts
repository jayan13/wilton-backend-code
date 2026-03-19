import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserLibraryRelation1675925430204 implements MigrationInterface {
  name = 'addUserLibraryRelation1675925430204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_libraries_libraries" ("usersId" uuid NOT NULL, "librariesId" uuid NOT NULL, CONSTRAINT "PK_b6af2f3a18d359b15ca83e55494" PRIMARY KEY ("usersId", "librariesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_857f0575bd486ee8effd4dc803" ON "users_libraries_libraries" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3a42537de864394c4e823c462a" ON "users_libraries_libraries" ("librariesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_libraries_libraries" ADD CONSTRAINT "FK_857f0575bd486ee8effd4dc803b" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_libraries_libraries" ADD CONSTRAINT "FK_3a42537de864394c4e823c462a1" FOREIGN KEY ("librariesId") REFERENCES "libraries"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_libraries_libraries" DROP CONSTRAINT "FK_3a42537de864394c4e823c462a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_libraries_libraries" DROP CONSTRAINT "FK_857f0575bd486ee8effd4dc803b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3a42537de864394c4e823c462a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_857f0575bd486ee8effd4dc803"`,
    );
    await queryRunner.query(`DROP TABLE "users_libraries_libraries"`);
  }
}
