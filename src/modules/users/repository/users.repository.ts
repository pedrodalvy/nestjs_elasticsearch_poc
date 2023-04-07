import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable, Logger } from '@nestjs/common';
import { SearchUsersQueryParamsDTO } from '../dto/search-users-query-params.dto';
import { User } from '../interfaces/user.interface';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class UsersRepository {
  constructor(private readonly logger: Logger, private readonly elasticsearchService: ElasticsearchService) {}

  async searchUser({ query, from, size }: SearchUsersQueryParamsDTO): Promise<User[]> {
    this.logger.log('Init', 'UserRepository');

    const searchResponse = await this.elasticsearchService.search({
      index: 'users',
      from,
      size,
      query: { wildcard: { username: { value: `*${query}*` } } },
      sort: { priority: { order: 'desc' } },
    });

    const users = searchResponse.hits.hits.map(({ _source }: SearchHit<User>) => {
      return { id: _source.id, name: _source.name, username: _source.username };
    });

    this.logger.log('End', 'UserRepository');
    return users;
  }
}
