import { mockDeep } from 'jest-mock-extended';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersElasticsearchImporter } from '../users-elasticsearch.importer';
import * as mockFs from 'mock-fs';
import { listaRelevancia1TxtFixture } from './fixtures/lista_relevancia_1.txt';
import { listaRelevancia2TxtFixture } from './fixtures/lista_relevancia_2.txt';
import { databaseCsvFixture } from './fixtures/database.csv.fixture';

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
    beforeEach(() => {
      mockFs({
        [`${process.cwd()}/assets`]: {
          'lista_relevancia_1.txt': listaRelevancia1TxtFixture,
          'lista_relevancia_2.txt': listaRelevancia2TxtFixture,
          'database.csv': databaseCsvFixture,
        },
      });
    });

    afterEach(mockFs.restore);

    it('should call ElasticsearchService.helpers.bulk with correct users priority', async () => {
      // ARRANGE
      const firstUserDataOfFixture = {
        id: 'fixture_id_1',
        name: 'fixture_name_1',
        userName: 'fixture_user_name_1',
        // priority: UsersPriorityEnum.HIGH,
      };
      const secondUserDataOfFixture = {
        id: 'fixture_id_2',
        name: 'fixture_name_2',
        userName: 'fixture_user_name_2',
        // priority: UsersPriorityEnum.MEDIUM,
      };
      const thirdUserDataOfFixture = {
        id: 'fixture_id_3',
        name: 'fixture_name_3',
        userName: 'fixture_user_name_3',
        // priority: UsersPriorityEnum.LOW,
      };

      // ACT
      await usersElasticsearchImporter.run();

      // ASSERT
      expect(elasticsearchServiceMock.helpers.bulk).toHaveBeenCalledWith(
        expect.objectContaining({
          onDocument: expect.any(Function),
        }),
      );
    });
  });
});
