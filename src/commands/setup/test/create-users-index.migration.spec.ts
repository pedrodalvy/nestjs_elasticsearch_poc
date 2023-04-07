import { mockDeep } from 'jest-mock-extended';
import { CreateUsersIndexMigration } from '../create-users-index.migration';
import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MappingProperty, PropertyName } from '@elastic/elasticsearch/lib/api/types';

describe('CreateUserIndexMigration', function () {
  let createUsersIndexMigration: CreateUsersIndexMigration;

  const elasticsearchServiceMock = mockDeep<ElasticsearchService>();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CreateUsersIndexMigration, { provide: ElasticsearchService, useValue: elasticsearchServiceMock }],
    }).compile();

    createUsersIndexMigration = app.get(CreateUsersIndexMigration);
  });

  describe('run()', function () {
    const usersIndex = 'users';
    const usersProperties: Record<PropertyName, MappingProperty> = {
      id: { type: 'keyword' },
      name: { type: 'text' },
      username: { type: 'keyword' },
      priority: { type: 'integer' },
    };

    it('should should call ElasticsearchService.indices.putMapping if users index has already been created', async () => {
      // ARRANGE
      elasticsearchServiceMock.indices.exists.mockResolvedValueOnce(true);

      // ACT
      await createUsersIndexMigration.run();

      // ASSERT
      expect(elasticsearchServiceMock.indices.exists).toHaveBeenCalledWith({ index: usersIndex });
      expect(elasticsearchServiceMock.indices.putMapping).toHaveBeenCalledWith({
        index: usersIndex,
        properties: usersProperties,
      });
    });

    it('should should call ElasticsearchService.indices.create if users index has not been created', async () => {
      // ARRANGE
      elasticsearchServiceMock.indices.exists.mockResolvedValueOnce(false);

      // ACT
      await createUsersIndexMigration.run();

      // ASSERT
      expect(elasticsearchServiceMock.indices.exists).toHaveBeenCalledWith({ index: usersIndex });
      expect(elasticsearchServiceMock.indices.create).toHaveBeenCalledWith({
        index: usersIndex,
        mappings: { properties: usersProperties },
      });
    });
  });
});
