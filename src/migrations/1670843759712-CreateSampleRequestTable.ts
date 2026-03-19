import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSampleRequestTable1670843759712
  implements MigrationInterface
{
  name = 'CreateSampleRequestTable1670843759712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."sample_requests_samplesize_enum" AS ENUM('FEET_1x2', 'FEET_2x3', 'FEET_3x4')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sample_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sampleSize" "public"."sample_requests_samplesize_enum" NOT NULL DEFAULT 'FEET_1x2', "colors" json NOT NULL, "patternImage" xml NOT NULL, "requestedBy" uuid, "design" uuid, CONSTRAINT "PK_2ddb925f45d411d0910833b389e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_requests" ADD CONSTRAINT "FK_db4715687f65755bbd985172bf3" FOREIGN KEY ("requestedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_requests" ADD CONSTRAINT "FK_dc8cf4a2505b5de2551ae21fc7e" FOREIGN KEY ("design") REFERENCES "designs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sample_requests" DROP CONSTRAINT "FK_dc8cf4a2505b5de2551ae21fc7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sample_requests" DROP CONSTRAINT "FK_db4715687f65755bbd985172bf3"`,
    );
    await queryRunner.query(`DROP TABLE "sample_requests"`);
    await queryRunner.query(
      `DROP TYPE "public"."sample_requests_samplesize_enum"`,
    );
  }
}
