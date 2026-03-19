import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDesignTable1670790550828 implements MigrationInterface {
  name = 'CreateDesignTable1670790550828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "designs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "colors" json NOT NULL, "patternImage" xml NOT NULL, "createdRole" character varying NOT NULL, "createdBy" uuid, CONSTRAINT "PK_3679aaa73bc37ec35a24a3cfde8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "designs" ADD CONSTRAINT "FK_944ab73a66d8356ad34bb63ff8c" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "designs" DROP CONSTRAINT "FK_944ab73a66d8356ad34bb63ff8c"`,
    );
    await queryRunner.query(`DROP TABLE "designs"`);
  }
}
