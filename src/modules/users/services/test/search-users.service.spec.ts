import { SearchUsersService } from '../search-users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { Logger } from '@nestjs/common';
import { UsersRepository } from '../../repository/users.repository';
import { User } from '../../interfaces/user.interface';

describe('SearchUsersService', function () {
  let searchUsersService: SearchUsersService;

  const loggerMock = mock<Logger>();
  const usersRepositoryMock = mock<UsersRepository>();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SearchUsersService,
        { provide: Logger, useValue: loggerMock },
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    searchUsersService = app.get(SearchUsersService);
  });

  describe('search', function () {
    it('should call Logger.log with correct params', async () => {
      // ACT
      await searchUsersService.search({ query: '', from: 0, size: 0 });

      // ASSERT
      expect(loggerMock.log).toHaveBeenCalledTimes(2);
      expect(loggerMock.log).toHaveBeenNthCalledWith(1, 'Init', 'SearchUsersService');
      expect(loggerMock.log).toHaveBeenNthCalledWith(2, 'End', 'SearchUsersService');
    });

    it('should call UsersRepository.searchUser with correct Params', async () => {
      // ARRANGE
      const query = 'search_value';
      const from = 0;
      const size = 10;

      // ACT
      await searchUsersService.search({ query, from, size });

      // ASSERT
      expect(usersRepositoryMock.searchUser).toHaveBeenCalledWith({ query, from, size });
    });

    it('should return correct values', async () => {
      // ARRANGE
      const query = 'search_value';
      const from = 0;
      const size = 10;

      const mockedUsers: User[] = [
        { id: 'id_1', name: 'Name 1', username: 'name1' },
        { id: 'id_2', name: 'Name 2', username: 'name2' },
      ];

      usersRepositoryMock.searchUser.mockResolvedValueOnce(mockedUsers);

      // ACT
      const response = await searchUsersService.search({ query, from, size });

      // ASSERT
      expect(response).toEqual({ from, size, data: mockedUsers });
    });
  });
});
