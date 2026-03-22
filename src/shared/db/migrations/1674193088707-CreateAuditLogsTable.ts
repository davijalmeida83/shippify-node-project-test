import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogsTable1674193088707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE audit_logs (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        entity VARCHAR(255) NOT NULL,
        operation VARCHAR(50) NOT NULL,
        oldData LONGTEXT NULL,
        newData LONGTEXT NULL,
        user VARCHAR(255) NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IDX_AUDIT_LOGS_ENTITY_OPERATION_TIMESTAMP
      ON audit_logs (entity, operation, timestamp);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IDX_AUDIT_LOGS_ENTITY_OPERATION_TIMESTAMP ON audit_logs;`);
    await queryRunner.query(`DROP TABLE audit_logs;`);
  }
}