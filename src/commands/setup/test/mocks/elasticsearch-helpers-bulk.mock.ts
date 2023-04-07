import { BulkHelper, BulkHelperOptions } from '@elastic/elasticsearch/lib/helpers';
import { ReadStream } from 'fs';

export const mockedElasticsearchBulkHelper = (processedElasticsearchBulkData: any[]) => {
  return ({ datasource, onDocument }: BulkHelperOptions<ReadStream>): BulkHelper<unknown> => {
    return new Promise((resolve) => {
      datasource['on']('data', (data: ReadStream) => {
        const callbackResponse = onDocument(data);
        processedElasticsearchBulkData.push({ callbackResponse, data });
      });

      datasource['on']('end', () => resolve({} as BulkHelper<any>));
    }) as BulkHelper<any>;
  };
};
