import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { User } from '../../../interfaces/user.interface';

export const elasticsearchUsersResponseFixture: SearchResponse<User & { priority: number }, unknown> = {
  took: 1,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 2,
      relation: 'eq',
    },
    max_score: null,
    hits: [
      {
        _index: 'users',
        _id: 'id_1',
        _score: null,
        _source: {
          id: 'id_1',
          name: 'First Name',
          username: 'firstname',
          priority: 2,
        },
        sort: [2],
      },
      {
        _index: 'users',
        _id: 'id_2',
        _score: null,
        _source: {
          id: 'id_2',
          name: 'Second Name',
          username: 'second.name',
          priority: 0,
        },
        sort: [0],
      },
    ],
  },
};
