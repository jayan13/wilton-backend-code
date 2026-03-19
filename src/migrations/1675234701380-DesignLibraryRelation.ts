import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignLibraryRelation1675234701380 implements MigrationInterface {
  name = 'DesignLibraryRelation1675234701380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "designs_libraries_libraries" ("designsId" uuid NOT NULL, "librariesId" uuid NOT NULL, CONSTRAINT "PK_3c6b6bf7834ad1d3349aeedce73" PRIMARY KEY ("designsId", "librariesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_892d886869b1d8873d5164f148" ON "designs_libraries_libraries" ("designsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e167922492b0cebd828b498c27" ON "designs_libraries_libraries" ("librariesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "designs_libraries_libraries" ADD CONSTRAINT "FK_892d886869b1d8873d5164f1481" FOREIGN KEY ("designsId") REFERENCES "designs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "designs_libraries_libraries" ADD CONSTRAINT "FK_e167922492b0cebd828b498c275" FOREIGN KEY ("librariesId") REFERENCES "libraries"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "designs_libraries_libraries" DROP CONSTRAINT "FK_e167922492b0cebd828b498c275"`,
    );
    await queryRunner.query(
      `ALTER TABLE "designs_libraries_libraries" DROP CONSTRAINT "FK_892d886869b1d8873d5164f1481"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e167922492b0cebd828b498c27"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_892d886869b1d8873d5164f148"`,
    );
    await queryRunner.query(`DROP TABLE "designs_libraries_libraries"`);
  }
}
