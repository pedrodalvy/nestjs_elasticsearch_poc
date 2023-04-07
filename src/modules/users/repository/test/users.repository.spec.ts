import { mock, mockDeep } from 'jest-mock-extended';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { elasticsearchUsersResponseFixture } from './fixtures/elasticsearch-users-response.fixture';
import { User } from '../../interfaces/user.interface';

describe('UsersRepository', function () {
  let usersRepository: UsersRepository;

  const loggerMock = mock<Logger>();
  const elasticsearchServiceMock = mockDeep<ElasticsearchService>();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: Logger, useValue: loggerMock },
        { provide: ElasticsearchService, useValue: elasticsearchServiceMock },
      ],
    }).compile();

    usersRepository = app.get(UsersRepository);
  });

  describe('searchUser', function () {
    it('should call Logger.log with correct params', async () => {
      // ARRANGE
      elasticsearchServiceMock.search.mockResolvedValueOnce(elasticsearchUsersResponseFixture);

      // ACT
      await usersRepository.searchUser({ query: 'any_value', from: 0, size: 15 });

      // ASSERT
      expect(loggerMock.log).toHaveBeenCalledTimes(2);
      expect(loggerMock.log).toHaveBeenNthCalledWith(1, 'Init', 'UserRepository');
      expect(loggerMock.log).toHaveBeenNthCalledWith(2, 'End', 'UserRepository');
    });

    it('should call ElasticsearchService.search with correct params', async () => {
      // ARRANGE
      const query = 'search_value';
      const from = 10;
      const size = 10;

      elasticsearchServiceMock.search.mockResolvedValueOnce(elasticsearchUsersResponseFixture);

      // ACT
      await usersRepository.searchUser({ query, from, size });

      // ASSERT
      expect(elasticsearchServiceMock.search).toHaveBeenCalledWith({
        index: 'users',
        from,
        size,
        query: { wildcard: { username: { value: `*${query}*` } } },
        sort: { priority: { order: 'desc' } },
      });
    });

    it('should return correct user data', async () => {
      // ARRANGE
      elasticsearchServiceMock.search.mockResolvedValueOnce(elasticsearchUsersResponseFixture);

      const firstParsedUser: User = {
        id: elasticsearchUsersResponseFixture.hits.hits[0]._source.id,
        name: elasticsearchUsersResponseFixture.hits.hits[0]._source.name,
        username: elasticsearchUsersResponseFixture.hits.hits[0]._source.username,
      };
      const secondParsedUser: User = {
        id: elasticsearchUsersResponseFixture.hits.hits[1]._source.id,
        name: elasticsearchUsersResponseFixture.hits.hits[1]._source.name,
        username: elasticsearchUsersResponseFixture.hits.hits[1]._source.username,
      };

      // ACT
      const response = await usersRepository.searchUser({ query: 'any_value', from: 0, size: 15 });

      // ASSERT
      expect(response).toHaveLength(2);
      expect(response[0]).toEqual(firstParsedUser);
      expect(response[1]).toEqual(secondParsedUser);
    });

    it('should return an empty array if user record is not found', async () => {
      // ARRANGE
      const emptyResponseFixture = { ...elasticsearchUsersResponseFixture };
      emptyResponseFixture.hits.hits = [];

      elasticsearchServiceMock.search.mockResolvedValueOnce(emptyResponseFixture);

      // ACT
      const response = await usersRepository.searchUser({ query: 'any_value', from: 0, size: 15 });

      // ASSERT
      expect(response).toHaveLength(0);
    });
  });
});
