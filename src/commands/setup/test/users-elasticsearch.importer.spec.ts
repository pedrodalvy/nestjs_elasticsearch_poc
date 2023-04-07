import { mockDeep } from 'jest-mock-extended';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersElasticsearchImporter } from '../users-elasticsearch.importer';
import * as mockFs from 'mock-fs';
import { listaRelevancia1TxtFixture } from './fixtures/lista_relevancia_1.txt';
import { listaRelevancia2TxtFixture } from './fixtures/lista_relevancia_2.txt';
import { databaseCsvFixture } from './fixtures/database.csv.fixture';
import { UsersPriorityEnum } from '../users-priority.enum';
import { mockedElasticsearchBulkHelper } from './mocks/elasticsearch-helpers-bulk.mock';

describe('UsersElasticsearchImporter', function () {
  let usersElasticsearchImporter: UsersElasticsearchImporter;

  const elasticsearchServiceMock = mockDeep<ElasticsearchService>();

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UsersElasticsearchImporter, { provide: ElasticsearchService, useValue: elasticsearchServiceMock }],
    }).compile();

    usersElasticsearchImporter = app.get(UsersElasticsearchImporter);
  });

  describe('run()', function () {
    afterEach(mockFs.restore);

    it('should not fail to process empty files', async () => {
      // ARRANGE
      mockFs({
        [`${process.cwd()}/assets`]: {
          'lista_relevancia_1.txt': '',
          'lista_relevancia_2.txt': '',
          'database.csv': '',
        },
      });

      const processedElasticsearchBulkData = [];
      elasticsearchServiceMock.helpers.bulk.mockImplementationOnce(
        mockedElasticsearchBulkHelper(processedElasticsearchBulkData),
      );

      // ACT
      await usersElasticsearchImporter.run();

      // ASSERT
      expect(elasticsearchServiceMock.helpers.bulk).toHaveBeenCalled();
      expect(processedElasticsearchBulkData.length).toEqual(0);
    });

    it('should process all users data', async () => {
      // ARRANGE
      const firstExpectedUserData = {
        id: 'fixture_id_1',
        name: 'fixture_name_1',
        username: 'fixture_user_name_1',
        priority: UsersPriorityEnum.HIGH,
      };

      const secondExpectedData = {
        id: 'fixture_id_2',
        name: 'fixture_name_2',
        username: 'fixture_user_name_2',
        priority: UsersPriorityEnum.MEDIUM,
      };

      const thirdExpectedData = {
        id: 'fixture_id_3',
        name: 'fixture_name_3',
        username: 'fixture_user_name_3',
        priority: UsersPriorityEnum.LOW,
      };

      mockFs({
        [`${process.cwd()}/assets`]: {
          'lista_relevancia_1.txt': listaRelevancia1TxtFixture,
          'lista_relevancia_2.txt': listaRelevancia2TxtFixture,
          'database.csv': databaseCsvFixture,
        },
      });

      const processedElasticsearchBulkData = [];
      elasticsearchServiceMock.helpers.bulk.mockImplementationOnce(
        mockedElasticsearchBulkHelper(processedElasticsearchBulkData),
      );

      // ACT
      await usersElasticsearchImporter.run();

      // ASSERT
      expect(processedElasticsearchBulkData.length).toEqual(3);
      expect(processedElasticsearchBulkData[0].data).toEqual(firstExpectedUserData);
      expect(processedElasticsearchBulkData[1].data).toEqual(secondExpectedData);
      expect(processedElasticsearchBulkData[2].data).toEqual(thirdExpectedData);
    });
  });
});
