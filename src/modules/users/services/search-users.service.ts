import { Injectable, Logger } from '@nestjs/common';
import { SearchUsersQueryParamsDTO } from '../dto/search-users-query-params.dto';
import { SearchUsersResponseDTO } from '../dto/search-users-response.dto';
import { UsersRepository } from '../repository/users.repository';

@Injectable()
export class SearchUsersService {
  constructor(private readonly logger: Logger, private readonly usersRepository: UsersRepository) {}

  async search({ query, from, size }: SearchUsersQueryParamsDTO): Promise<SearchUsersResponseDTO> {
    this.logger.log('Init', 'SearchUsersService');

    const users = await this.usersRepository.searchUser({ query, from, size });

    this.logger.log('End', 'SearchUsersService');
    return { from, size, data: users };
  }
}
