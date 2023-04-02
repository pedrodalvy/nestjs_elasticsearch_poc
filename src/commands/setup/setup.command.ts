import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { CreateUsersIndexMigration } from './create-users-index.migration';

@Command({ name: 'setup', description: 'Setup project' })
export class SetupCommand extends CommandRunner {
  private readonly context = 'Setup';

  constructor(private readonly logger: Logger, private readonly createUsersIndexMigration: CreateUsersIndexMigration) {
    super();
  }

  async run(): Promise<void> {
    this.logger.log('Starting application setup...', this.context);

    this.logger.log('Creating users indexes...', this.context);
    await this.createUsersIndexMigration.run();

    this.logger.log('Populating data...', this.context);
    this.logger.log('Setup Finished', this.context);
  }
}
