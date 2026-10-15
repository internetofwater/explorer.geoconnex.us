import { TRawGetTotalSites } from '@/sparql/queries/getTotalSites';
import { TGraphResponse } from '@/sparql/queries/types';

export const TEST_GET_TOTAL_SITES_RESPONSE: TGraphResponse<TRawGetTotalSites> =
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
                        value: '40',
                    },
                },
            ],
        },
        meta: {
            'query-time-ms': 10,
            'result-size-total': 1,
        },
    };
