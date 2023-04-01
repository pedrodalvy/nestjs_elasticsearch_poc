import { Logger, Module } from '@nestjs/common';
import { SetupCommand } from './setup/setup.command';

@Module({
  providers: [SetupCommand, { provide: Logger, useClass: Logger }],
})
export class CommandModule {}
