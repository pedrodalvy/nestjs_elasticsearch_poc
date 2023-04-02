import 'dotenv/config';

import { Logger, Module } from '@nestjs/common';
import { SetupCommand } from './setup/setup.command';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { CreateUsersIndexMigration } from './setup/create-users-index.migration';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ES8_NODE,
    }),
  ],
  providers: [SetupCommand, { provide: Logger, useClass: Logger }, CreateUsersIndexMigration],
})
export class CommandModule {}
