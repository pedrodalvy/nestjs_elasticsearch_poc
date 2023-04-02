import 'dotenv/config';

import { Logger, Module } from '@nestjs/common';
import { SetupCommand } from './setup/setup.command';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { CreateUsersIndexMigration } from './setup/create-users-index.migration';
import { UsersElasticsearchImporter } from './setup/users-elasticsearch.importer';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ES8_NODE,
    }),
  ],
  providers: [
    SetupCommand,
    { provide: Logger, useClass: Logger },
    CreateUsersIndexMigration,
    UsersElasticsearchImporter,
  ],
})
export class CommandModule {}
