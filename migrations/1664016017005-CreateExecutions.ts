import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExecutions1664016017005 implements MigrationInterface {
    name = 'CreateExecutions1664016017005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "executions" ("id" SERIAL NOT NULL, "commands" integer NOT NULL, "result" integer NOT NULL, "duration" double precision NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_703e64e0ef651986191844b7b8b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "executions"`);
    }

}
