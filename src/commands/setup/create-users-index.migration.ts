import { Injectable } from '@nestjs/common';
import { MappingProperty, PropertyName } from '@elastic/elasticsearch/lib/api/types';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class CreateUsersIndexMigration {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async run(): Promise<void> {
    const index = 'users';
    const properties: Record<PropertyName, MappingProperty> = {
      id: { type: 'keyword' },
      name: { type: 'text' },
      userName: { type: 'keyword' },
      priority: { type: 'integer' },
    };

    const indexExists = await this.elasticsearchService.indices.exists({ index });

    indexExists
      ? await this.elasticsearchService.indices.putMapping({ index, properties })
      : await this.elasticsearchService.indices.create({ index, mappings: { properties } });
  }
}
