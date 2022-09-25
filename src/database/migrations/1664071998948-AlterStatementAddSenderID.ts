import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterStatementAddSenderID1664071998948 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("statements", "type");
    await queryRunner.addColumn("statements",
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw', 'transfer']
      }))

    await queryRunner.addColumn("statements",
      new TableColumn({
        name: 'sender_id',
        type: 'uuid',
        isNullable: true
      }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("statements", "sender_id");

    await queryRunner.dropColumn("statements", "type");
    await queryRunner.addColumn("statements",
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['deposit', 'withdraw']
      }))
  }
}
