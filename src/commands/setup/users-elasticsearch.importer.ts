import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { UsersPriorityEnum } from './users-priority.enum';
import * as process from 'process';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class UsersElasticsearchImporter {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async run(): Promise<void> {
    const databaseUsersFileHeaders = ['id', 'name', 'userName'];

    const highPriorityIDs = this._getPriorityIDsFrom(process.cwd() + '/assets/lista_relevancia_1.txt');
    const mediumPriorityIDs = this._getPriorityIDsFrom(process.cwd() + '/assets/lista_relevancia_2.txt');

    const usersPriorityMap = this._generatePriorityMap(highPriorityIDs, mediumPriorityIDs);

    const usersDatasource = fs
      .createReadStream(process.cwd() + '/assets/database.csv')
      .pipe(csvParser(databaseUsersFileHeaders));

    await this.elasticsearchService.helpers.bulk({
      datasource: usersDatasource,
      onDocument: (document: any) => {
        document.priority = this._getUserPriority(document.id, usersPriorityMap);
        return { index: { _index: 'users', _id: document.id } };
      },
    });
  }

  private _getPriorityIDsFrom(filepath: string): Set<string> {
    const fileContent = fs.readFileSync(filepath, 'utf8');
    return new Set(fileContent.split('\n'));
  }

  private _generatePriorityMap(mediumPriorityIDs: Set<string>, highPriorityIDs: Set<string>): Map<string, number> {
    const priorityMap = new Map();

    mediumPriorityIDs.forEach((id) => priorityMap.set(id, UsersPriorityEnum.MEDIUM));
    highPriorityIDs.forEach((id) => priorityMap.set(id, UsersPriorityEnum.HIGH));

    return priorityMap;
  }

  private _getUserPriority(userId: string, usersPriorityMap: Map<string, number>): UsersPriorityEnum {
    return usersPriorityMap.get(userId) || UsersPriorityEnum.LOW;
  }
}
