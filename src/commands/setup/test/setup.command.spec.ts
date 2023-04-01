import { Test, TestingModule } from '@nestjs/testing';
import { SetupCommand } from '../setup.command';
import { Logger } from '@nestjs/common';

describe('SetupCommand', function () {
  let setupCommand: SetupCommand;

  const loggerMock = { log: jest.fn() };

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [SetupCommand, { provide: Logger, useValue: loggerMock }],
    }).compile();

    setupCommand = app.get(SetupCommand);
  });

  describe('run()', function () {
    it('should call Logger with correct params', async () => {
      // ACT
      await setupCommand.run();

      // ASSERT
      expect(loggerMock.log).toHaveBeenCalledWith('Starting application setup...', 'Setup');
      expect(loggerMock.log).toHaveBeenCalledWith('Connecting to Elasticsearch...', 'Setup');
      expect(loggerMock.log).toHaveBeenCalledWith('Creating user indexes...', 'Setup');
      expect(loggerMock.log).toHaveBeenCalledWith('Populating data...', 'Setup');
      expect(loggerMock.log).toHaveBeenCalledWith('Setup Finished', 'Setup');
    });
  });
});
