import { Test, TestingModule } from '@nestjs/testing';
import { SetupCommand } from '../setup.command';
import { Logger } from '@nestjs/common';
import { CreateUsersIndexMigration } from '../create-users-index.migration';
import { mock } from 'jest-mock-extended';
import { UsersElasticsearchImporter } from '../users-elasticsearch.importer';

describe('SetupCommand', function () {
  let setupCommand: SetupCommand;

  const loggerMock = mock<Logger>();
  const createUsersIndexMigrationMock = mock<CreateUsersIndexMigration>();
  const usersElasticsearchImporterMock = mock<UsersElasticsearchImporter>();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SetupCommand,
        { provide: Logger, useValue: loggerMock },
        { provide: CreateUsersIndexMigration, useValue: createUsersIndexMigrationMock },
        { provide: UsersElasticsearchImporter, useValue: usersElasticsearchImporterMock },
      ],
    }).compile();

    setupCommand = app.get(SetupCommand);
  });

  describe('run()', function () {
    it('should call Logger with correct params', async () => {
      // ACT
      await setupCommand.run();

      // ASSERT
      expect(loggerMock.log).toHaveBeenCalledTimes(4);
      expect(loggerMock.log).toHaveBeenCalledWith('Starting application setup...', 'Setup');
      expect(loggerMock.log).toHaveBeenCalledWith('Creating users indexes...', 'Setup');
      expect(loggerMock.log).toHaveBeenCalledWith('Populating data...', 'Setup');
      expect(loggerMock.log).toHaveBeenCalledWith('Setup Finished', 'Setup');
    });

    it('should call CreateUsersIndexMigration.run()', async () => {
      // ACT
      await setupCommand.run();

      // ASSERT
      expect(createUsersIndexMigrationMock.run).toHaveBeenCalledTimes(1);
    });

    it('should call UsersElasticsearchImporter.run()', async () => {
      // ACT
      await setupCommand.run();

      // ASSERT
      expect(usersElasticsearchImporterMock.run).toHaveBeenCalledTimes(1);
    });
  });
});
