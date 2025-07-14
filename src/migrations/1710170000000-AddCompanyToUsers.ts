import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCompanyToUsers1710170000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'auth.users',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.query(
      `UPDATE "auth"."users" SET "company_id" = '48d602e3-e588-4f28-b7d1-58d4ca0f3522'`,
    );

    await queryRunner.changeColumn(
      'auth.users',
      'company_id',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'auth.users',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'auth.system_settings',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('auth.users');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('company_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('auth.users', foreignKey);
    }
    await queryRunner.dropColumn('auth.users', 'company_id');
  }
}
