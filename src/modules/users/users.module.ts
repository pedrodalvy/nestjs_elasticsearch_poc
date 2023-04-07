import { Logger, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { SearchUsersService } from './services/search-users.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { UsersRepository } from './repository/users.repository';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ES8_NODE,
    }),
  ],
  controllers: [UsersController],
  providers: [SearchUsersService, UsersRepository, { provide: Logger, useClass: Logger }],
})
export class UsersModule {}
