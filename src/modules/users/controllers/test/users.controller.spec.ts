import { UsersController } from '../users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { SearchUsersService } from '../../services/search-users.service';
import { SearchUsersQueryParamsDTO } from '../../dto/search-users-query-params.dto';
import { SearchUsersResponseDTO } from '../../dto/search-users-response.dto';
import { User } from '../../interfaces/user.interface';

describe('UsersController', function () {
  let usersController: UsersController;

  const searchUsersServiceMock = mock<SearchUsersService>();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: SearchUsersService, useValue: searchUsersServiceMock }],
    }).compile();

    usersController = app.get(UsersController);
  });

  describe('search', function () {
    it('should call SearchUsersService.search with correct params', async () => {
      // ARRANGE
      const queryParams: SearchUsersQueryParamsDTO = { query: 'any_value ', from: 10, size: 10 };

      // ACT
      await usersController.search(queryParams);

      // ASSERT
      expect(searchUsersServiceMock.search).toHaveBeenCalledWith(queryParams);
    });

    it('should call SearchUsersService.search with default params', async () => {
      // ARRANGE
      const queryParams: SearchUsersQueryParamsDTO = { query: 'any_value ' };

      // ACT
      await usersController.search(queryParams);

      // ASSERT
      expect(searchUsersServiceMock.search).toHaveBeenCalledWith({ query: queryParams.query, from: 0, size: 15 });
    });

    it('should return correct params', async () => {
      // ARRANGE
      const queryParams: SearchUsersQueryParamsDTO = { query: 'any_value ', from: 10, size: 10 };
      const mockedUsers: User[] = [{ id: 'id_1', name: 'Name 1', username: 'name1' }];
      const searchUsersResponseMock: SearchUsersResponseDTO = { from: 10, size: 10, data: mockedUsers };

      searchUsersServiceMock.search.mockResolvedValueOnce(searchUsersResponseMock);

      // ACT
      const response = await usersController.search(queryParams);

      // ASSERT
      expect(response).toEqual(searchUsersResponseMock);
    });
  });
});
