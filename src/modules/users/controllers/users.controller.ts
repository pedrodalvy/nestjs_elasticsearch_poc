import { Controller, Get, Query } from '@nestjs/common';
import { SearchUsersService } from '../services/search-users.service';
import { SearchUsersQueryParamsDTO } from '../dto/search-users-query-params.dto';
import { SearchUsersResponseDTO } from '../dto/search-users-response.dto';

@Controller()
export class UsersController {
  constructor(private readonly searchUsersService: SearchUsersService) {}

  @Get('search')
  search(@Query() { query, from = 0, size = 15 }: SearchUsersQueryParamsDTO): Promise<SearchUsersResponseDTO> {
    return this.searchUsersService.search({ query, from, size });
  }
}
