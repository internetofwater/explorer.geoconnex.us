import { TRawGetDatasetCount } from '@/sparql/queries/getDatasetCount';
import { TGraphResponse } from '@/sparql/queries/types';

export const TEST_GET_DATASET_COUNT_RESPONSE: TGraphResponse<TRawGetDatasetCount> =
    {
        head: {
            vars: ['count'],
        },
        results: {
            bindings: [
                {
                    count: {
                        datatype: 'http://www.w3.org/2001/XMLSchema#int',
                        type: 'literal',
                        value: '32336',
                    },
                },
            ],
        },
        meta: {
            'query-time-ms': 540,
            'result-size-total': 1,
        },
    };
