import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';

@Command({ name: 'setup', description: 'Setup project' })
export class SetupCommand extends CommandRunner {
  private readonly context = 'Setup';

  constructor(private readonly logger: Logger) {
    super();
  }

  async run(): Promise<void> {
    this.logger.log('Starting application setup...', this.context);
    this.logger.log('Connecting to Elasticsearch...', this.context);
    this.logger.log('Creating user indexes...', this.context);
    this.logger.log('Populating data...', this.context);
    this.logger.log('Setup Finished', this.context);
  }
}
