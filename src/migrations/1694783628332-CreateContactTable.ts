import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateContactTable1694783628332 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "contact" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "contact" VARCHAR NOT NULL,
                "userId" VARCHAR
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "contact"
        `);
    }

}
