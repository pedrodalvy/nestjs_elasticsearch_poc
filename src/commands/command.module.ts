import 'dotenv/config';

import { Logger, Module } from '@nestjs/common';
import { SetupCommand } from './setup/setup.command';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ES8_NODE,
    }),
  ],
  providers: [SetupCommand, { provide: Logger, useClass: Logger }],
})
export class CommandModule {}
